/* Defines all the routes */
var express = require('express');
var router = express.Router();
var passport = require('passport');
var userController = require('../controllers/userController.js');


router.get('/login',function(req,res){
	return userController.Get_login(req,res);
});
router.post('/login',passport.authenticate('local'),function(req,res){
	return userController.Post_login(req,res);
})

router.get('/signup',function(req,res){
	return userController.Get_signup(req,res);
})

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

module.exports = router;