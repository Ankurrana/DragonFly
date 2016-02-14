/* Defines all the routes */
var express = require('express');
var router = express.Router();
var passport = require('passport');
var loginController = require('../controllers/loginController.js');
var auth = require('../middlewares/auth.js');

router.get('/testAuthentication',auth,function(req,res){
	res.json({
		'username' : req.user.username,
		'email' : req.user.email
	});
})

router.get('/login',loginController.Get_login);
router.post('/login',passport.authenticate('local'),loginController.Post_login);
router.get('/signup',loginController.Get_signup);
router.post('/signup',loginController.Post_signup);
router.get('/logout',loginController.Get_logout);

module.exports = router;