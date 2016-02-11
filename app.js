var express = require('express');
var app = express();
var appConfig = require('./config/config.js')
appConfig.init(app);


app.get('/login',function(req,res){
	res.sendFile(__dirname + '/views/login.html')
})
app.post('/login',app.passport.authenticate('local'),function(req,res){
	res.send(req.user);
})

app.use(express.static(__dirname + "/public"));

/*  
	Started Server at host localhost and port 3000 

*/
app.listen(3000,function(){
	console.log('Started listening to 3000');
})