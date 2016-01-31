// config/passport.js

// load all the things we need

var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var User            = require('../models/UserCRUD.js');

// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(email, password, done) {
          User.validateUserByEmail(email,password,function(err,user,InvalidData){
          	console.log(err);
          	if(false) console.log();
          	else{
          		if(!user)
          			done(null,false,{message:"Error During Authentication, check username and password!"})
          		else{
          			done(null,user);
          		}
          	}
          })
    }));

};

// var passportLocal = require('passport-local');
// var User = require('../models/UserCRUD.js');



// var localStratergy = new passportLocal(
// 	function(userEmail,password,done){
// 		User.validateUserByEmail(userEmail,password,function(err,res){
// 			if(err) 
// 				done(err);
// 			else{
// 				if(res == true)
// 					return done(null,res)
// 				else
// 					return done(null,false,{message:"Incorrect password"})
// 			}
// 		});
// 	}
// );
// module.exports = localStratergy;