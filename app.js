var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');
var cookieParser = require('cookie-parser');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser());

app.use(session({ secret: 'SECRET' }));
app.use(passport.initialize());
app.use(passport.session());

var passportConfig = require('./middlewares/Passport.js')(passport);



app.get('/login',function(req,res){
	res.sendFile(__dirname + '/views/login.html')
})


app.post('/login',
	passport.authenticate('local',{
		successRedirect : '/',
		failureRedirect : '/LoginFailure'
	}),function(req,res){
		return res.redirect('/');
});


app.get('/',function(req,res){
	res.send(req.user.username + 'LoginSuccessFull!');
})


app.get('/LoginFailure',function(req,res){
	res.send('LoginFailure!');
})

app.use(express.static(__dirname + "/public"));


/*Started Server at host localhost and port 3000 */
app.listen(3000,function(){
	console.log('Started listening to 3000');
})