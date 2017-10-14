var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    senderId: String,
    recipientId: String,
    firstname: String,
    name: String,
    profilePic: String,
    locale: String,
    timezone: String,
    gender: String,
    createdAt: Date
});

module.exports = mongoose.model('User', UserSchema);
