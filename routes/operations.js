var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var Model = require('../models/user');

function ensureAuthenticated(req, res, next) {
  if(req.isAuthenticated()){
    return next();
  } else {
    //req.flash('error_msg','Please Login to continue');
    res.redirect('/chat/login');
  }
}


router.get('/',ensureAuthenticated,function(req, res){
  res.redirect('/chat/login');
});




// to get chat window page
router.get('/window',ensureAuthenticated, function(req, res){
	res.render('window');
});

// Login
router.get('/login', function(req, res){
	res.render('login');
});

passport.use(new LocalStrategy(
  function(username, password, done) {  
   Model.getUserByUsername(username, function(err, user){
   	if(err) throw err;
   	if(!user){
   		return done(null, false, {message: 'Unknown User'});
   	}

   	Model.comparePassword(password, user.password, function(err, isMatch){
   		if(err) throw err;
   		if(isMatch){
   			return done(null, user);
   		} else {
   			return done(null, false, {message: 'Invalid password'});
   		}
   	});
   });
  }));
 

passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  Model.getUserById(id, function(err, user) {
    done(err, user);
  });
});
router.post('/login',
  passport.authenticate('local', {successRedirect:'/chat/window', failureRedirect:'/chat/login',failureFlash: true}),
  function(req, res) {  
    res.redirect('/chat/window');
  });

router.get('/logout', function(req, res){
	req.logout();
	req.flash('success_msg', 'You are logged out');	
	res.redirect('/chat/login');
});


module.exports = router;
