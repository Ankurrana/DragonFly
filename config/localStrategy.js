var passport_local = require('passport-local');
var User = require('../models/User.js'); 
var localStrategy = passport_local.Strategy;

var local = new localStrategy({
	'usernameField' : 'email',
	'passwordField' : 'password'
},function(username,password,done){
	User.validateUserByEmail(username,password,function(err,user){
		if(err)
			done(err)
		if(!user)
			done(null,false,{'message':"Wrong Username"});
		else
			done(null,user)
	})
})

module.exports = local;