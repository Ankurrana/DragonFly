var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var passConfig = require('./passConfig.js');
var path = require('path');
var morgan = require('morgan');
var fs = require('fs');
var accessLogStream = fs.createWriteStream(path.join(__dirname,'../logs/morgan.log'), {flags: 'a'});
const MongoStore = require('connect-mongo')(session);
var mongoose = require('./../models/mongooseConnection.js');

var bb = require('express-busboy');

function configure(app){
	app.use(bodyParser.urlencoded({ extended: false }))
	app.use(bodyParser.json())
	app.use(cookieParser());
	app.use(session({ 
		secret: 'SECRET', 
		saveUninitialized: true,
		resave:true,
		store : new MongoStore({ mongooseConnection: mongoose.connection })
	}));
	app.use(morgan('common',{'stream': accessLogStream}));
	app.use(passport.initialize());
	app.use(passport.session());
	passConfig.init(passport);
	app.passport = passport; //This is a test code, added passport directly to the app object.


	bb.extend(app,{
		upload: true
	});

}

module.exports = {
	'init' : configure,
}