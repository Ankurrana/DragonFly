/*
*		LoginController
*		Handles the request to and from the login , user/profile ... 
		Controllers will render views to the functions calling them!
*/

var path = require('path');
var User = require('../models/User.js');

var loginController =  {
	Get_login : function(req,res){
		res.sendFile('login.html', { root: path.join(__dirname, '../public') });
	},
	Post_login : function(req,res){
		// res.redirect('/testAuthentication');
		res.json({
			username : req.user.username,
			email : req.user.email
		});
	},
	Get_signup : function(req,res){
		res.sendFile('signup.html', { root: path.join(__dirname, '../public') });
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