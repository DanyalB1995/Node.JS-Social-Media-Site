var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var multer = require('multer');
var upload = multer({dest:'./uploads'});
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user.js');
var Note = require('../models/notes.js');
var Group = require('../models/group.js');
var Twitter = require('../twitter/twitter.js');


//get pages
router.get('/', function(req, res, next) {
    res.render('login',{title:"Login"});
});

router.get('/register', function(req, res, next) {
  res.render('register', {title:'Register'});
});

router.get('/login', function(req, res, next) {
  res.render('login',{title:"Login"});
    
});

router.get('/settings', function(req, res, next) {
    res.render('settings',{title:"Settings"});
    
});
router.get('/test', function(req, res, next) {
    res.render('test',{title:"Test"});
    
});

//login
router.post('/login',
  passport.authenticate('local', {failureRedirect:'/users/login'}),
  function(req, res) {

    Twitter.getTags(req.user.tags);
    console.log(req.user.tags);
    res.redirect('/users/moods');
});

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});
passport.use(new LocalStrategy(function(username, password, done){
    User.getUserByUsername(username, function(err, user){
       if(err) throw err; 
       if(!user){
           console.log("hello!!");
           return done(null, false);
       }    
       User.comparePassword(password, user.password, function(err, isMatch){
        if(err) return done(err);
        if(isMatch){
            console.log(user);
            return done(null, user);
        } else {
            console.log("hereqpqppqp");
            return done(null, false);
        }
       });    
    });
}));


//register user
router.post('/register', upload.single('profileImage'), function(req, res, next) {
    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;
    var colour = "#e7e7e7";
    var spotify = "https://open.spotify.com/embed/album/2lFG71r2xVdO0ogynuwSNU";
    var tags = "none";
    var mood = "sad";
    
    
    req.checkBody('name', 'Name field is required').notEmpty();
    req.checkBody('email', 'Email field is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('username', 'Name field is required').notEmpty();
    req.checkBody('password', 'Password field is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
    
    var errors = req.validationErrors();
    
    if(errors){
        res.render('register', {
            errors: errors
        });
    } else{
        var newUser = new User({
           name: name, 
           email: email,
           username: username,
           password: password,
           profileImage: profileimage,
           tags: tags,
            settings: {
                happy: {
                    colour: colour,
                    spotify: spotify
                },
                meh: {
                    colour: colour,
                    spotify: spotify
                },
                sad: {
                    colour: colour,
                    spotify: spotify
                }
            },
            mood: mood
        });
        
        User.createUser(newUser, function(err, user){
           if(err) throw err;
            console.log(user);
        });
        
        console.log('You are now registered');
        
        
        res.location('/users/moods');
        res.redirect('/users/moods');
    }
    
});

//add settings
router.post('/moods', function(req, res){
    var happyColour = req.body.happyColour;
    var happySpotify = req.body.happySpotify;
    var mehColour = req.body.mehColour;
    var mehSpotify = req.body.mehSpotify;
    var sadColour = req.body.sadColour;
    var sadSpotify = req.body.sadSpotify;
    var tag = req.body.changeTag;
    
    User.setMoods(req.user._id, happyColour, happySpotify, mehColour, mehSpotify, sadColour, sadSpotify);
    User.saveSettings(req.user._id, tag);
    Twitter.getTags(tag);
    res.redirect('/users/happyPlace');
});

router.post('/changeMood', function(req, res){
    var mood = req.body.mood1;
    console.log(mood);
    User.moodUpdate(req.user._id, mood);
    res.redirect('/users/happyplace');
});

//addNote
router.post('/notes', function(req, res){
        var newNote = new Note({
           username: req.user.username,
           note:{title:req.body.noteTitle, 
                 body:req.body.noteBody}
        });
        Note.addNote(newNote, function(err, notes){
           if(err) throw err;
            console.log(notes);
        });
        res.redirect('/users/happyPlace');
});

router.post('/joinGroup', function(req, res){
   var group = req.body.group;
   var user = req.body.user;
   Group.join(group, user);
});

//create a group
router.post('/creategroups', function(req, res, next) {
    var gName = req.body.groupName;
    var desc = req.body.description;
    var user = req.user.username;
    var users = [req.user.username];
    
    console.log(gName);
    console.log(desc);
    
    req.checkBody('gName', 'Group Name field is required').notEmpty();
    req.checkBody('desc', 'Description is required').notEmpty();

    var errors = req.validationErrors();
    
    if(errors){
        res.render('createGroup', {
            errorsGroups: errors
        });
    } else{
        var newGroup = new Group({
           group:{title: gName, 
                  description: desc,
                  creator: user},
           members: users
            
        });
        
        Group.addGroup(newGroup, function(err, group){
           if(err) throw err;
            console.log(group);
        });
        
        console.log('You are have now created a group');
        console.log('new group');
        
        res.location('/users/happyplace');
        res.redirect('/users/happyplace');
    }
    
});

//logout
router.get('/logout', function(req, res){
   req.logout();
   console.log('you are now logged out');
   res.redirect('/users/login');
});

module.exports = router;
