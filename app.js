
'use strict'
var express = require('express');
var app = express();
var appConfig = require('./config/config.js');
var passport = require('passport');
var globals = require('./config/GLOBALS.js');
appConfig.init(app);
app.set('views', __dirname + '/public/views');
app.set('view engine','jade')
var api = require('./routes/api.js');
var superapi = require('./routes/superapi.js');


app.use('/api',api);
app.use('/superapi',superapi);

app.use('/iamsuper',function(req,res){
	if(req.user && req.user._id == globals["SuperuserID"]){
		res.render('superIndex');
	}else{
		res.send('You are not authenticated to view this page!')
	}
})

app.use('/public',express.static(__dirname + "/public"));
app.use('/',function(req,res){
	res.render('index');			
});

app.use('*',function(req,res){
	res.status(404).render('notfound',{message:'this is the message',title:'NinTendo!'});
})


if(!process.env.PORT){
	process.env.PORT = 3000;
}

app.listen(process.env.PORT,function(){
	console.log('Started listening to 3000');
});		


