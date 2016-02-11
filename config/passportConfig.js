var passport = require('passport');
var passport_local = require('passport-local');

var localStrategy = passport_local.Strategy;

var local = new localStrategy({
	'usernameField' : 'email',
	'passwordField' : 'password'
},function(username,password,done){
	done(null,{
		'id' : 1,
		'username' : "Ankur",
		'email' : "Asdsad"
	})
})

// passport.use(local);
module.exports = local;