var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var secrets = require('./config/secrets')

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// set the view engine to ejs
// app.set('view engine', 'ejs');

// make express look in the public directory for assets (css/js/img)
// app.use(express.static(__dirname + '/public'));

// set the home page route
app.get('/', function(req, res) {

    // ejs render automatically looks in the views folder
    res.send('hi');
});

app.get('/webhook', function(req, res) {
    if (req.query['hub.verify_token'] === secrets.ACCESS_TOKEN) {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Error, wrong validation token');
    }
})

app.post('/webhook', function(req, res) {

    for (var jj = 0; jj < req.body.entry.length;jj++) {
        
        var messaging_events = req.body.entry[jj].messaging;
        for (var i = 0; i < messaging_events.length; i++) {
            var myEvent = req.body.entry[jj].messaging[i];

            request({
                url: 'https://graph.facebook.com/v2.6/me/messages',
                qs: {access_token: 'EAABvjrWKCeMBAA5Di9rOmargy1561JqEY6mhCPPiO2kLw82O52LZAAIFbUKaM6ZAiuneVE3z8EIzU6dgWYdqsQNhBFCFIJLCZCcvYNvs42apkPsyJcOjFhXWI0ngRA8QgOxWvsGXN032XB6xKdtY8mbru9zZAwVFdnFZAW1cZC64yD2EuHHkOt'},
                method: 'POST',
                json: {
                    recipient: {id: myEvent.sender.id},
                    message: { text: myEvent.message.text },
                }
            }, function (error, response, body) {
                if (error) {
                    console.log('Error sending message: ', error);
                } else if (response.body.error) {
                    console.log('Error: ', response.body.error);
                }
            });
        }
    }

    res.sendStatus(200);
})

app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});