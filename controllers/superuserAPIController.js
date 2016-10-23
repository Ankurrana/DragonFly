var User = require('./userController.js');
var ErrorManager = require('../config/Errors/ErrorGenerator.js');
var validationController = require('./validatorController.js');
var GLOBALS = require('../config/GLOBALS.js');
var superuserController = require('./superuserController.js')

var superuserAPIController = {
	getUserGroups : function(req,res){
		if(req != null ){
			superuserController.getUserGroups(function(err,data){
                if(!err){
                    res.send(data);
                }else{
                    res.status(500).send('Some Problem Occured!')
                }
            })
		}
	},

    getUserGroup : function(req,res){
        if(req){
            var groupId = req.params.groupId;
            superuserController.getUserGroup(groupId,function(Err,data){
                res.send(data);
            }) 
        }
    },
    createUserGroup : function(req,res){
        if(req){
        	console.log(req.query);
            var groupName = req.query.name;
            superuserController.createUserGroup(groupName,function(err,data){
                if(!err)
                	res.send(data);
            	else{
            		res.status(500).send(err);
            	}
            })
        }
    },
	updateGroup : function(req,res){
		if(req){
            var userId = req.body.userId;
			var action = req.body.action; // 1 to add , otherwise remove 
            var groupId = req.params.groupId;
			console.log(userId + " " + action + " " + groupId );
			if(action == "1"){
				
				superuserController.addUserToGroup(groupId,userId,function(err,data){
					if(!err)
						res.send(data);
					else{
						res.status(500).send(err);
					}
				})
			}
			else{
				superuserController.deleteUserFromGroup(groupId,userId,function(err,data){
					if(!err)
						res.send(data);
					else{
						res.status(500).send(err);
					}
				})
			}
        }
	},
	addUserGroupToUser : function(req,res){
		var userId = req.params.userId;
		var groupId = req.body.groupId;
		console.log(userId);
		console.log(groupId);
		User.addUserGroupToUser(userId,groupId,function(err,data){
			res.send(err,data);			
		})
	}	

	// createUser : function(req,res){
	// 	if(req!=null && req.body!=null){
	// 		var formData = req.body;
	// 		User.createUser(formData,function(err,createdUser){
	// 			if(err != null ){
	// 				res.send(createdUser);					
	// 			}else{
	// 				err.message = 'Error Occurred while saving the user into the Database!';
	// 				res.send(err);
	// 			}
	// 		})
	// 	}else{	
	// 		var error = {};
	// 		error.message = 'Empty Request Object';
	// 		ErrorManager(error);
	// 		res.send(error);
	// 	}
	// },

	// getUsers : function(req,res){
	// 	var searchUsername = req.query.username;
	// 	// console.log(searchUsername);
	// 	User.getUsers(searchUsername,function(err,data){
	// 		if(err){
	// 			res.send(err);
	// 		}else{
	// 			res.send(data);
	// 		}
	// 	})
	// }
	
}

module.exports = superuserAPIController;
//Test


