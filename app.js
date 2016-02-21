var express = require('express');
var app = express();
var appConfig = require('./config/config.js')
appConfig.init(app);
var router = require('./routes/routes.js');
var testRouter = require('./routes/testRoutes.js');
var myMiddleware = require('./middlewares/helperMiddleware')
app.use('/admin',testRouter);
app.use('/',router);
app.use(myMiddleware);

app.use('/',express.static(__dirname + "/public"));

app.use('*',function(req,res){
	res.json({
		'msg' : "Not Found!"
	});
})

/*  Started Server at host localhost and port 3000 */
app.listen(3000,function(){
	console.log('Started listening to 3000');
})