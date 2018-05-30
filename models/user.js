var mongoose = require("mongoose");
var bcrypt = require('bcryptjs');

mongoose.connect('mongodb://localhost/myHappyPlace');

var db = mongoose.connection;

//Users MongoDB Schema
var UserSchema = mongoose.Schema({

    username: {
        type: String,
        index: true
    },
    password: {
        type: String
    },
    email: {
        type: String
    },
    name: {
        type: String
    },
    settings: {
        happy: {
            colour: String,
            spotify: String
        },
        meh: {
            colour: String,
            spotify: String
        },
        sad: {
            colour: String,
            spotify: String
        }
        
    },
    tags: {
        type: String
    },
    mood: {
        type: String
    }
});

var User = module.exports = mongoose.model('User', UserSchema, "users");

//Get a user from the database using there ID
module.exports.getUserById = function(id, callback){
    User.findById(id, callback);
}

//Get a user from the database using there username
module.exports.getUserByUsername = function(username, callback){
    console.log(username);
    var query = {username: username};
    User.findOne(query, callback);
}

//Password login check
module.exports.comparePassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        console.log(isMatch);
        if (err) { throw (err); }
        callback(null, isMatch);
    });
}

//Create a user
module.exports.createUser = function (newUser, callback) {
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newUser.password, salt, function (err, hash) {
           newUser.password = hash;
           newUser.save(callback); 
        });
    });
    
}

//Set a users mood
module.exports.setMoods = function(id, happyColour, happySpotify, mehColour, mehSpotify, sadColour, sadSpotify){
   User.findByIdAndUpdate(id,{$set: {settings:{happy: {
                                                colour: happyColour,
                                                spotify: happySpotify
                                               },
                                               meh: {
                                                colour: mehColour,
                                                spotify: mehSpotify
                                               },
                                               sad: {
                                                 colour: sadColour,
                                                 spotify: sadSpotify
                                                }}}}, function(err, result){
        if(err){
            console.log(err);
        }
        console.log("RESULT: " + result);
    });
}

//Upsate users current mood
module.exports.moodUpdate = function(id, mood){
    User.findByIdAndUpdate(id,{$set: {mood:mood}}, function(err, result){
        if(err){
            console.log(err);
        }
        console.log("RESULT: " + result);
    });
}



