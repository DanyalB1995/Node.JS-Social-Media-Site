var express = require('express');
var mongoose = require("mongoose");
var router = express.Router();
var Note = require('../models/notes.js');
var Group = require('../models/group.js');
var User = require('../models/user.js');


//Ensure there is an account logged in
router.get('/users/happyplace', ensureAuthenticated,function(req, res, next) {
    //Check what is users current mood
    if(req.user.mood == 'happy'){
        console.log('happy');
        mood = req.user.settings.happy.colour;
        playlist =  req.user.settings.happy.spotify;
    }
    else if(req.user.mood == 'meh'){
         console.log('meh');
        mood = req.user.settings.meh.colour;
        playlist =  req.user.settings.meh.spotify;
    }
    else if(req.user.mood == 'sad'){
        console.log('sad');
        mood = req.user.settings.sad.colour;
        playlist =  req.user.settings.sad.spotify;
       
    }
    //Find notes for user logged in
    Note.find({username: req.user.username}, function(err, notes){
        Group.find({members: req.user.username}, function(err, groups){
            res.render('happyPlace', { title: 'happy place',notes: notes, groups:groups, user: req.user, colour: mood, spotify: playlist});
        });
    });
});

//Render Pages
router.get('/users/groups', ensureAuthenticated,function(req, res, next) {
    Group.find({}, function(err, groups1){
        Group.find({members: req.user.username}, function(err, groups){
            res.render('groupChats',{title:"Groups", groups1: groups1, user: req.user, groups:groups});
        });
    });
});

router.get('/users/creategroups', ensureAuthenticated,function(req, res, next) {
    console.log(req.body);
    res.render('createGroup',{title:"Create Groups", user: req.user});
});


router.get('/users/moods', ensureAuthenticated,function(req, res, next) {
    res.render('moods', { title: 'moods', user:req.user});
});

function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } 
    res.redirect('/users/login');

}

function moodSetter(req, res, next){

    return mood;
}


module.exports = router;
