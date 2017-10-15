var mongoose = require('mongoose');

var PlaceSchema = new mongoose.Schema({
    lat: Number,
    lng: Number,
    rankingValue: Number,
    createdAt: Date
});

module.exports = mongoose.model('Place', PlaceSchema);
