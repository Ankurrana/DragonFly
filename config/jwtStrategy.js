var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;

var jwt = require('jwt-simple');
var User = require('../models/User.js'); 



var opts = {};
opts.secretOrKey = 'ankur';

opts.jwtFromRequest = function (req) {
  headers = req.headers;
  if (headers && headers.jwt) {
    var parted = headers.jwt.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};

var k = new JwtStrategy(opts, function(jwt_payload, done) {
  console.log('Hi There!');
  User.findOne({username: jwt_payload.username}, function(err, user) {
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