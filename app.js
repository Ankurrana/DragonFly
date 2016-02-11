var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var passport_local = require('passport-local');
var localStrategy = require('./config/passportConfig.js');


var helper = require('./middlewares/helperMiddleware.js');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser());
app.use(session({ secret: 'SECRET' }));
app.use(passport.initialize());
app.use(passport.session());
passport.use(localStrategy);


passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});


app.get('/login',function(req,res){
	res.sendFile(__dirname + '/views/login.html')
})
app.post('/login',passport.authenticate('local'),function(req,res){
	res.send(req.user);
})

app.use(express.static(__dirname + "/public"));

/*Started Server at host localhost and port 3000 */
app.listen(3000,function(){
	console.log('Started listening to 3000');
})