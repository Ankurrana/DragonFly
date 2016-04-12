var localStrategy = require('./localStrategy.js');
var User = require("../models/User.js");
var jwtStrategy = require('./jwtStrategy.js');
function configure(passport){
	passport.use(jwtStrategy);
	passport.serializeUser(function(user, done) { done(null, user.id); });
	passport.deserializeUser(function(id, done) { User.findById(id, function(err, user) {done(err, user);});});
}

module.exports = {
	'init' : configure
}
