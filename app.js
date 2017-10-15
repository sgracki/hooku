var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');
var mongoose = require('mongoose');
var secrets = require('./config/secrets');
var User = require('./models/User');
var Place = require('./models/Place');
var path = require('path');
var async = require('async');
var sha256 = require('sha256');

const AUTH_TOKEN = 'f4e5c6dc7c5c26763b3ede80a0e6696f4dd813d098a0d39b232b4305807004f8';

var port = process.env.PORT || 4000;

mongoose.createConnection('mongodb://localhost:27017/hooku');
mongoose.connection.on(`error`, () => {
    console.error(`MongoDB Connection Error. Please make sure that MongoDB is running.`);
});
mongoose.Promise = global.Promise;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.set('view engine', 'ejs');

app.use('/', express.static(path.join(__dirname, './frontend')));

app.post('/new/user/:authToken', function(req, res) {
    if(sha256.x2(req.params.authToken) !== AUTH_TOKEN) { return res.sendStatus(404); }
    
    var user = new User({
        senderId: req.body.senderId,
        ranking: 0,
        places: []
    });

    user.save(function(err) {
        if(!err) {
            return res.send(user).status(200);
        }
    })
})

app.post('/new/place/:authToken', function(req, res) {
    if(sha256.x2(req.params.authToken) !== AUTH_TOKEN) { return res.sendStatus(404); }
    
    var place = new Place({
        lat: req.body.lat,
        lng: req.body.lng,
        rankingValue: 10,
        createdAt: new Date()
    })

    place.save(function(err) {
        if(!err) {
            res.send(place).status(200);
        }
    })
})

app.put('/place/:senderId/:authToken', function(req, res) {
    if(sha256.x2(req.params.authToken) !== AUTH_TOKEN) { return res.sendStatus(404); }

    User.findOne({
        senderId: req.params.senderId
    }).exec(function(err, user) {
        if(err) {
            return res.sendStatus(404);
        }

        
    })
})

app.get('/user/:senderId/:authToken', function(req, res) {
    if(sha256.x2(req.params.authToken) !== AUTH_TOKEN) { return res.sendStatus(404); }
    
    User.find({
        senderId: req.params.senderId
    }).exec(function(err, places) {
        if(err) {
            return res.sendStatus(404);
        }

        res.send(user)
    })
})

app.listen(port, function() {
    console.log(`App running on port { ${port} }`);
});
