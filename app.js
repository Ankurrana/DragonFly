'use strict'
var express = require('express');
var app = express();
var appConfig = require('./config/config.js');
var passport = require('passport');
appConfig.init(app);


app.set('view engine','jade')
var router = require('./routes/routes.js');
var testRouter = require('./routes/testRoutes.js');
// var taskRouter = require('./routes/task.js');

// console.log(taskRouter);

app.use('/test',testRouter);
// app.use('/task',function(req,res,next){ req.session.redirect_to = 'task'; next() },taskRouter);
app.use('/',router);

// app.use(myMiddleware);
// app.use('/',guiRouter);
app.use('/',express.static(__dirname + "/public"));

app.use('*',function(req,res){
	res.status(404).render('notfound',{message:'this is the message',title:'NinTendo!'});
})

/*  Started Server at host localhost and port 3000 */
app.listen(3000,function(){
	console.log('Started listening to 3000');
});

