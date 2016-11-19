

/* 	Registration API controller
	This controller will handle the request for creating and deleting a user.
	One of the major tasks of API Controllers is to make send good response object to the output
*/
var errorGenerator = require('../config/Errors/ErrorGenerator.js');
var userController = require('./userController.js');

var registrationController = {
	newUserRequestHandler : function(req,res){
		/* Will handle the requests for creating a new user */
		var userDetails = {};
		if(req!=null && req.body!=null){
			var formData = req.body;
			userDetails.name = formData.name;
			userDetails.username = formData.username;
			userDetails.email = formData.email;
			userDetails.password = formData.password;
			console.log(userDetails);
			userController.addUser(userDetails,function(err,userAdded){
				if(err){
					var error = errorGenerator(err,function(err){
						res.status(err.status).send(err);
					});				 
				}else{
					res.status(201).send({
						err  : 0,
						user : userAdded,
						uri : 'users/' + userAdded.username 
					})	
				}
			})
		}else{
			res.status(400).send({
				error : 1,
				type : 'informational',	
				desc : errorDescription['INFO-1']
			})
		}
	}
}

module.exports = registrationController;