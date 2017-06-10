var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// User and Admin Schema
var UserSchema = mongoose.Schema({
	username: {
		type: String,
		index:true
	},
	password: {
		type: String
	},
	email: {
		type: String
	},
	name: {
		type: String
	}
});
var MessageSchema = mongoose.Schema({
	username: {
		type: String,
		index:true
	},
	message: {
		type: String
	},
	date: {
        type: String
	}
});	
var User = module.exports = mongoose.model('users', UserSchema);

var Message = module.exports = mongoose.model('messages', MessageSchema);

module.exports.createMessage = function(newMessage, callback){

	        newMessage.save(callback);	
}


module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}
module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}