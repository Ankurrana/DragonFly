/*
*		LoginController
*		Handles the request to and from the login , user/profile ... 
		Controllers will render views to the functions calling them!
*/

var path = require('path');
var User = require('../models/User.js');

var loginController =  {
	Get_login : function(req,res){
		res.render('login',{action:'/login'});
	},
	Post_login : function(req,res){
		var redirect_to = req.session.redirect_to ? req.session.redirect_to : '/';
		delete req.session.redirect_to;
		res.redirect(redirect_to);
	},
	Get_signup : function(req,res){
		res.render('signup');
	},
	Post_signup : function(req,res){
		User.addUser({
			'name' : req.body.name,
			'username' : req.body.username,
			'email' : req.body.email,
			'password' : req.body.password
		},function(err,data){
			if(err)
				res.json({
					err : 1,
					msg : "Err : " + err
				});
			else{
					res.json({
							err : 0,
							msg : 'Successfully Registered with username :' + data.username 
					});
			}
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