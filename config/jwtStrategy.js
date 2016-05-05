var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var GLOBALS = require('../config/GLOBALS.js')
var jwt = require('jwt-simple');
var User = require('../models/User.js'); 

var opts = {};
opts.secretOrKey = GLOBALS['SECRET_ENCRYPTION_KEY'];

opts.jwtFromRequest = function (req) {
  headers = req.headers;
  if (headers && headers.jwt){
    return headers.jwt; 
  }
};

var k = new JwtStrategy(opts, function(jwt_payload, done) {
  User.findOne({username: jwt_payload.username},'username name email' ,function(err, user) {
      if (err) {
          return done(err, false);
      }
      if (user) {
          done(null, user);
      } else {
          done(null, false);
      }
  });
})

module.exports = k; 