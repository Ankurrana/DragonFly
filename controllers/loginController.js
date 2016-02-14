/*
*		oginController
*		Handles the request to and from the login , user/profile ... 
		Controllers will render views to the functions calling them!
*/

var path = require('path');
var User = require('../models/User.js');

var loginController =  {
	Get_login : function(req,res){
		res.sendFile('login.html', { root: path.join(__dirname, '../views') });
	},
	Post_login : function(req,res){
		res.json({
			username : req.user.username,
			email : req.user.email
		});
	},
	Get_signup : function(req,res){
		res.sendFile('signup.html', { root: path.join(__dirname, '../views') });
	},
	Post_signup : function(req,res){
		User.addUser({
			'name' : req.body.name,
			'username' : req.body.username,
			'email' : req.body.email,
			'password' : req.body.password
		},function(err){
			if(!err)
				res.redirect('/');
			else
				res.redirect('/signup');
		});
	},
	Get_logout : function(req, res){
		if(req.isAuthenticated()){
	  		req.logout();
	  		res.redirect('/');
	  	}
	  	else
	  			res.redirect('/login');
	},
}

module.exports = loginController;