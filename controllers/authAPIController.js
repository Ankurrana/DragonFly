var userController = require('./userController.js');
var errorGenerator = require('../config/Errors/ErrorGenerator.js');
var validationController = require('./validatorController.js');
var GLOBALS = require('../config/GLOBALS.js');
var jwt = require('jwt-simple');


var authController = {
	requestAuthorisationToken : function(req,res){
		if(req == null || req.body == null){
			var error = {
				code : '1'
			}
			errorGenerator(error,function(err){
				res.status(err.status).send(err);
			})
		}else{
			var formData = req.body;
			err = validationController.areCredentialsValid(formData);
			if( err != true ){
				var error = {};
				error.message = err;
				error.code = '500';
				errorGenerator(error,function(erro){
					res.status(erro.status).send(erro);
				});
			}
			else{
				/* Do here the authorisation Part */
				var username = formData.username;
				var password = formData.password;
				userController.authenticateUser(username,password,function(err,authenticatedUser){
					if(err){
						err.code = '3';
						errorGenerator(err,function(erro){
							res.send(erro);
						});
					}else{
							var token = jwt.encode(authenticatedUser,GLOBALS['SECRET_ENCRYPTION_KEY'] );
					        res.json({success: true, token: token});					
					}
				})


			}

		}
	}
}



module.exports = authController;
