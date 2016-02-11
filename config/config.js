var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var passConfig = require('./passConfig.js');


function configure(app){
	app.use(bodyParser.urlencoded({ extended: false }))
	app.use(bodyParser.json())
	app.use(cookieParser());
	app.use(session({ secret: 'SECRET' }));
	app.use(passport.initialize());
	app.use(passport.session());
	passConfig.init(passport);
	app.passport = passport; //This is a test code, added passport directly to the app object.
}

module.exports = {
	'init' : configure,
}