var User = require('./userController.js');
var ErrorManager = require('../config/Errors/ErrorGenerator.js');
var validationController = require('./validatorController.js');
var GLOBALS = require('../config/GLOBALS.js');

var userAPIController = {
	getUser : function(req,res){
		if(req != null ){
			var username =  req.params.username;
			User.getUserByUsername(username,function(err,user){
				if(err){
					res.send({
						success : false,
						error : err
					})
				}else{

					res.send(user);
				}
			})
		}
	},
	createUser : function(req,res){
		if(req!=null && req.body!=null){
			var formData = req.body;
			User.createUser(formData,function(err,createdUser){
				if(err != null ){
					res.send(createdUser);					
				}else{
					err.message = 'Error Occurred while saving the user into the Database!';
					res.send(err);
				}
			})
		}else{	
			var error = {};
			error.message = 'Empty Request Object';
			ErrorManager(error);
			res.send(error);
		}
	}	
}

module.exports = userAPIController;

