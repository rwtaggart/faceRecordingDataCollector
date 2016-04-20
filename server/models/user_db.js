"use strict"

/**
 *  This file will be used to connect to the user-specific DB
 */
var debug = require('debug')('dcDb');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/data-collector')

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    debug('(D):  We have a database connection!');
    var userSchema = mongoose.Schema({
        fname:  String,
        lname:  String,
        email:  String,
        participantId: Number,
        consent: Boolean,
    })
    
    var participantSchema = mongoose.Schema({
        participantId: Number,
        ethnicity: String,
        gender:    String,
        glasses:   Boolean,
        faceHair:  Boolean,
        faceMarks: Boolean,
        comments:  String,
        video:     Buffer
    })
    
    module.exports.User = mongoose.model('User', userSchema);
    module.exports.Participant = mongoose.model('Participant', participantSchema);
})