"use strict";
/*
 *  This is an example of how we use mongoose to connect to a database.
 * 
 *  Make sure to npm instsall mongoose, npm install -g mongodb. 
 *  Kick off the mongodb server with mongod
 *
 *  Note: This file can be run on it's own with 'node mongoose.js'
 */
 
 // We connect to the database.
 // In this case, is our local 'test' database.
 var mongoose = require('mongoose');
 mongoose.connect('mongodb://localhost/test');
 
 // We can now connect to the db, set our error handling, 
 // and also set up our schema when the connection is 'open'.
 var db = mongoose.connection;
 db.on('error', console.error.bind(console, 'connection error:'));
 db.once('open', function() {
    // We've connected to the db!!!
    // Time to create a schema in mongoose.
    var kittySchema = mongoose.Schema({
        name: String,
        content: String
    });
    
    // NOTE:  We need to append methods to the model before we compile it in mongoose.
    //        We do this with the mongoose.model method.
    //        These methods are then exposed to each model instance object.
    kittySchema.methods.speak = function() {
        var greeting = this.name
            ? "Meow name is " + this.name
            : "I don't haz name. :(";
        console.log("(I):  Kitty's message! '" + greeting + "'");
    }
    
    // Mongoose models are classes which contain the documents that we will use to put into the db.
    // These models have attributes which are defined in the schemas.
    var Kitten = mongoose.model('Kitten', kittySchema);
    var winston = new Kitten({name: 'winston', content: 'Stuff! this is stuff. we put stuff here. meow.'});
    console.log("(D):  This is our kitty's name! '" + winston.name + "'");
    
    // Let's call the speak method on bentley
    var bentley = new Kitten({name: 'Bentley', content: 'Hey! yeah. so umm. I\'m a cat.'});
    bentley.speak();
    
    //We can squirel these methods away in the db with .save() method.
    winston.save(function(err, winston) {
        if (err) return console.error(err);
        winston.speak()
    });
    
    bentley.save(function(err) {
        if (err) console.error(err);
    })
    
    // We can use the model to retrieve all of the things we've seens thus far:
    Kitten.find(function(err, results) {
        console.log("(D):  we got some results back!");
        console.log(results);
    })
    
    // We can also look for specific stuff.
    Kitten.find({name: /^Bent/ }, function(err, results) {
        console.log("(D):  we got some results back!");
        console.log(results);
        
        // We're done. We can close the connection now.
        // Make sure to call this last. Node will automatically exit when the db connection is closed.
        db.close();
    })
});