var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var passport = require('passport');
var passportLocal = require('passport-local');
var session = require('express-session');
var cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(session({ secret: 'SECRET' }));
app.use(passport.initialize());
app.use(passport.session());




app.use(express.static(__dirname + "/public"));


/*Started Server at host localhost and port 3000 */
app.listen(3000,function(){
	console.log('Started listening to 3000');
})