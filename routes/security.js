var express = require('express');
var router = express.Router();

// Get Homepage
router.get('/chat/window', ensureAuthenticated, function(req, res){
	res.render('window');
});

function ensureAuthenticated(req, res, next) {
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','Please Login to continue');
		res.redirect('/chat/login');
	}
}
router.get('/', ensureAuthenticated, function(req, res){
	res.redirect('/chat/login');
});
module.exports = router;
