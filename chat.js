var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongodb = require('mongodb');
var mongoose = require('mongoose');
var util=require('util');
var fs=require('fs');
var Model = require('./models/user');

//connect to the mongoosedb
mongoose.connect('mongodb://localhost/login');
var db=mongoose.connction;   

// Init App
var app = express();  



// View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.set('view engine', 'handlebars');
//end view Engine for handlebars 


// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

var routes = require('./routes/security');
var chat = require('./routes/operations');
app.use('/', routes);
app.use('/chat', chat);

// Set Port
app.set('port', (process.env.PORT || 80));
var server = app.listen(app.get('port'), function(){
	console.log('Server started on port '+app.get('port'));
});


// socket chat


var io=require('socket.io').listen(server);
var users=[];
var connections=[];
io.sockets.on('connection',function(socket){
	connections.push(socket);
	util.log('one socket connected: %s sockets connected', connections.length);
	
	//Disconnect
	socket.on('disconnect', function (data) {
		users.splice(users.indexOf(socket.username),1);
		updateUsernames();
		connections.splice(connections.indexOf(socket),1);
	util.log('one socket Disconnected: %s sockets connected', connections.length);
	});
	// Send Message
	socket.on('send message',function(data){	
	if(data!==''){ 
			io.sockets.emit('new message', {msg:data, user: socket.username} );	
		
		var username = socket.username;
		var message = data;
		var newMessage = new Model({	
			username: username,
			message: message,
            date:new Date()
		});
			Model.createMessage(newMessage, function(err, user){
			if(err) throw err;
		});
		  	

  
	}
	});	
	// new user
	socket.on('new user',function(data, callback){
		
		if(data==''){
			callback(false);
		}else {
				callback(true);			
				socket.username=data;
				users.push(socket.username);
				updateUsernames();
		}
		
	});
	function updateUsernames(){
		io.sockets.emit('get users', users);
	}
});