var express = require('express');
var app = express();
var appConfig = require('./config/config.js');
var passport = require('passport');
appConfig.init(app);


app.set('view engine','jade')
var router = require('./routes/routes.js');
var testRouter = require('./routes/testRoutes.js');
// var taskRouter = require('./routes/task.js');
var auth = require('./middlewares/auth.js');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

var guiRouter = require('./routes/guiRouter.js');
// var myMiddleware = require('./middlewares/helperMiddleware');
var User = require('./models/User.js');
var jwt = require('jwt-simple');

app.post('/authenticate',function(req,res){
	User.findOne({
    'username': req.body.username
  },'username password -_id',function(err, user) {
    if (err) throw err;
    if (!user){
      res.send({success: false, msg: 'Authentication failed. User not found.'});
    } else {
      // check if password matches
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          // if user is found and password is right create a token
          var token = jwt.encode(user, 'ankur');
          // return the information including token as JSON
          res.json({success: true, token: 'JWT ' + token});
        } else {
          res.send({success: false, msg: 'Authentication failed. Wrong password.'});
        }
      });
    }
  });
})


app.use('/test',testRouter);
// app.use('/task',function(req,res,next){ req.session.redirect_to = 'task'; next() },taskRouter);
// app.use('/',router);
// app.use(myMiddleware);
// app.use('/',guiRouter);
// app.use('/',express.static(__dirname + "/public"));

app.use('*',function(req,res){
	res.status(404).render('notfound',{message:'this is the message',title:'NinTendo!'});
})

/*  Started Server at host localhost and port 3000 */
app.listen(3000,function(){
	console.log('Started listening to 3000');
});


