var mongoose = require("mongoose");
var bcrypt = require('bcryptjs');

mongoose.connect('mongodb://localhost/myHappyPlace');

var db = mongoose.connection;

//Notes MongoDB Schema
var NoteSchema = mongoose.Schema({

    username: {
        type: String,
        index: true
    },
    note:{
       title: String,
       body: String
   }
});

var Note = module.exports = mongoose.model('Note', NoteSchema, "notes");

//Add note
module.exports.addNote = function(newNote, callback){
    newNote.save(callback);
}