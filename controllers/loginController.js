/*
*		userController
*		Handles the request to and from the user/login , user/profile ... 
		Controllers will render views to the functions calling them!
*/

var path = require('path');

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
		res.send('This is the signup Page!');
	}
}

module.exports = loginController;