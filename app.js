var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var expressValidator = require('express-validator');
var LocalStrategy = require('passport-local').Strategy;
var multer = require('multer');
var upload = multer({dest:'./uploads'});
var bcrypt = require('bcryptjs');
var mongo = require('mongodb');
var socketio = require('socket.io')
var mongoose = require('mongoose');
var db = mongoose.connection;


var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

var server = app.listen(8080);
var io = require('socket.io')(server);

//Socket.IO social media chat
io.on('connection', function(socket){
  console.log('someone connected');
    
  socket.on('join', function(channel) {
    socket.join(channel, function () {
      console.log("Joined: ", channel);
    });
  }); 
    
  socket.on('chat message', function(msg, room, user){
    console.log(room);
    io.sockets.in(room).emit('chat message', user, msg);
    console.log(msg);
  });

  socket.on('leave', function(channel1) {
      socket.leave(channel1, function (err) {
        console.log("Left: " + channel1);
      });
});
      
});
 
//Access control
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Credentials', true);
  next();
}); 

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(session({
    secret:'secret',
    saveUninitialized: false,
    resave: true
}));

app.use(passport.initialize());
app.use(passport.session());


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(expressValidator()); 
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', index);
app.use('/users', users);


//Validator
app.use(expressValidator({
    errorFormatter: function(param, msg, value){
        var namespace = param.split('.')
        , root = namespace.shift()
        , formParam = root;
        
    while(namespace.length){
        formParam += '[' + namespace.shift() + ']';
    }
    return{
      param :formParam,
      msg : msg,
      value : value
    };
    }
}));

//Flash messages
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
