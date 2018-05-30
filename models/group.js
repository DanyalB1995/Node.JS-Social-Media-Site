var mongoose = require("mongoose");
var bcrypt = require('bcryptjs');

mongoose.connect('mongodb://localhost/myHappyPlace');

var db = mongoose.connection;

//Group MongoDB Schema
var GroupSchema = mongoose.Schema({
    group:{
       title:String,
       description:String,
       creator:String
   },
   members:[String]
});

var Group = module.exports = mongoose.model('Group', GroupSchema, "groups");

//Add group to DB
module.exports.addGroup = function(newGroup, callback){
    newGroup.save(callback);
}

//Add a member to the group
module.exports.join = function(group, user){
    Group.findByIdAndUpdate(group,{$addToSet:{members:user}},{safe: true, upsert: true, new: true}, function(err, result){
        if(err){
            console.log(err);
        }
        console.log(user);
        console.log("RESULT: " + result);
    });
}
