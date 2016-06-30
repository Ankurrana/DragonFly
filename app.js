
'use strict'
var express = require('express');
var app = express();
var appConfig = require('./config/config.js');
var passport = require('passport');
appConfig.init(app);
app.set('views', __dirname + '/public/views');
app.set('view engine','jade')
var api = require('./routes/api.js');


app.use('/api',api);
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


