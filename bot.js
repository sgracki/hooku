var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');
var mongoose = require('mongoose');
var secrets = require('./config/secrets');
var User = require('./models/User');
var path = require('path');
var async = require('async');
const FB_ACCESS_TOKEN = 'EAABvjrWKCeMBAA5Di9rOmargy1561JqEY6mhCPPiO2kLw82O52LZAAIFbUKaM6ZAiuneVE3z8EIzU6dgWYdqsQNhBFCFIJLCZCcvYNvs42apkPsyJcOjFhXWI0ngRA8QgOxWvsGXN032XB6xKdtY8mbru9zZAwVFdnFZAW1cZC64yD2EuHHkOt';

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 5000;

// mongoose.connect('mongodb://sgnanex@gmail.com:Szynekzaq12wsx@hooku.herokuapp.com:53312/hooku');
// mongoose.connection.on(`error`, () => {
//     console.error(`MongoDB Connection Error. Please make sure that MongoDB is running.`);
// });
// mongoose.Promise = global.Promise;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// set the view engine to ejs
// app.set('view engine', 'ejs');

// make express look in the public directory for assets (css/js/img)
// app.use(express.static(__dirname + '/public'));

// set the home page route
app.get('/', function(req, res) {
    res.send('hi');
});

app.get('/webhook', function(req, res) {
    if (req.query['hub.verify_token'] === secrets.ACCESS_TOKEN) {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Error, wrong validation token');
    }
})

function isFunction(functionToCheck) {
  var getType = {};
  return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

class tools {
  constructor(FB_ACCESS_TOKEN, event) {
    this.FB_ACCESS_TOKEN = FB_ACCESS_TOKEN;
    this.event = event;
  }

   sendText(text, quick_replies, callback) {
     request({
         url: 'https://graph.facebook.com/v2.6/me/messages',
         qs: {access_token: this.FB_ACCESS_TOKEN},
         method: 'POST',
         json: {
             recipient: { id: this.event.sender.id },
             message: {
               text: text,
               quick_replies: quick_replies
             },
         }
     }, function (error, response, body) {
         if (error) {
             console.log('Error sending message: ', error);
         } else if (response.body.error) {
             console.log('Error: ', response.body.error);
         } else {
           if(callback && isFunction(callback)) {
             callback();
           }
         }
     });
   }
}


var triggerPayload = {};

var askForPic = function(event) {
  request({
      url: 'https://graph.facebook.com/v2.6/me/messages',
      qs: {access_token: 'EAABvjrWKCeMBAA5Di9rOmargy1561JqEY6mhCPPiO2kLw82O52LZAAIFbUKaM6ZAiuneVE3z8EIzU6dgWYdqsQNhBFCFIJLCZCcvYNvs42apkPsyJcOjFhXWI0ngRA8QgOxWvsGXN032XB6xKdtY8mbru9zZAwVFdnFZAW1cZC64yD2EuHHkOt'},
      method: 'POST',
      json: {
          recipient: { id: event.sender.id },
          message: {
            text: "moj tekst jak siemasz"
          },
      }
  }, function (error, response, body) {
      if (error) {
          console.log('Error sending message: ', error);
      } else if (response.body.error) {
          console.log('Error: ', response.body.error);
      }
  });
}

var def = function(event) {
  console.log(event);

}

triggerPayload['USER_MUJ_PAYLOAD'] = function(e) { askForPic(e); }
triggerPayload['default'] = function(e) { def(e); }

app.post('/webhook', function(req, res) {

    for (var jj = 0; jj < req.body.entry.length;jj++) {

        var messaging_events = req.body.entry[jj].messaging;
        for (var i = 0; i < messaging_events.length; i++) {
            console.log(event);
            var myEvent = req.body.entry[jj].messaging[i];

            var event = JSON.parse(JSON.stringify(myEvent));

            var user = {};
                user.senderId = event.sender.id;
                user.recipientId = event.recipient.id;

            if(event.message && event.message.quick_reply && event.message.quick_reply.payload) {
              console.log("ss");
              var payload = event.message.quick_reply.payload;

              if(triggerPayload[payload]) {
                triggerPayload[payload](event);
              }
            } else {
              console.log("def");
              triggerPayload['default'](event);
            }


        }
    }

    res.sendStatus(200);
})
var a = new tools(FB_ACCESS_TOKEN, event);
a.


app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});
