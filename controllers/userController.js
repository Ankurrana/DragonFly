var User = require('../models/User.js');
var logger = require('./logController.js');
var ErrorManager = require('./ErrorController.js');
var validator = require('./validatorController.js');
var encryptor = require('../services/bcrypt.js');

/**
*  userController is the middletier between APIControllers and the Models. Only Middletier controllers will communicate
*  to Models. Any Business Logic / Valication / Sending Server Errors should be done here.
*	
*	UserController should first process that user Details for validation before sending those to the UserModel.
*
*   UserController should provide an envelop over all the functionalities of the UserModel. 
*/


var UserController = {
	/** 
	*	IntraController Function
	*/
	'getUser' : function(opts,cb){
		User.findOne(opts,function(err,user){
			if(err){
				err.code = 1,
				err.message = 'Some Fatal error occured in the database';
				cb(err);
			}else if(user == null){
				var err = {};
			    err.error = true;
			    err.message = 'Username Not Found';	
				ErrorManager(err,'Info','UserName not Found');
				cb(err);
			}else{
				cb(null,user);
			}
		})
	},
	getIdByUsername : function(username,cb){
		this.getUser({
			"username" : username
		},function(err,data){
			if(err){
				cb(err)
			}else{
				cb(null,data._id);
			}
		})
	}
	,	
	'getUserByUsername' : function(username,cb){
		this.getUser({"username":username},function(err,user){
			if(err){
				cb(err);
				return;
			}
			this.user = {};
			this.user.name = user.name;
			this.user.username = user.username;
			this.user.email = user.email;
			this.user.tasks = user.tasks;
			this.user.tasksCount = user.tasksCount;	
			cb(null,this.user);
		})	
	},
	'getUsernameById' : function(Id,cb){
		this.getUser({
			'_id' : Id
		},function(err,data){
			if(err)
				cb(err)
			else{
				cb(null,data.username);
			}
		})
	},
	getUsernamesByIds : function(Ids,cb){
		User.find({ '_id' : {
			$in : Ids
		}},'username',function(err,data){
			if(err)
				cb(err)
			else{
				cb(null,data);
			}
		})
	}
	,
	'getUsers' : function(username,cb){
		/* just gets the username of all the  */
		User.find({'username': new RegExp(username, 'i') },'username -_id',function(err,data){
			if(err)
				cb(err)
			else{
				// removing superuser as one of the users of system
				data = data.filter(function(val){return val.username!="superuser"})
				cb(null,data);
			}
		})
	},

	'addUser' : function(userDetails,cb){
		/* Validate User Info here */
		var err;
		err = validator.isUserValid(userDetails);
		if ( err == true ){
			User.addUser(userDetails,function(err,user){
				if(err){
					// err.message = 'Some Error occured while saving the userDetails :'+  userDetails +', check logs for info';
					// err.error = true;
					// ErrorManager(err,'Info','Some Error occured while saving the userDetails :'+  userDetails +', check logs for info');
					// var error = {};
					// error.message = err; 
					// err
					cb(err)
				}else{
					logger.info('New User Added to the Database' + user );
					cb(null,user);
				}
			});	
		}else{
			err.error = true;
			err.message = 'User details failed to validate , check logs for err.details';
			// err.details = errors;
			ErrorManager(err,'Info','Unable to validate user Details , check logs for err.details');
			cb(err);
		}
	},
	'addTaskToUserByUsername' : function(username,taskId,cb){
		this.getUser({'username':username},function(err,user){
			if(err){
				cb('Error :' + JSON.stringify(err));
			}else{
				var userId = user._id;
				User.assignTaskToUser(userId,taskId,function(err,model){
					if(err){
						ErrorManager(err,'Fatal Error','Error while updating into the user database');
						cb(err);
					}else{
						cb(null,true)
					}
				})		
			}
		})


		
	},
	'authenticateUser' : function(username,password,cb){
		this.getUser({'username':username},function(err,user){
			if(err){
				cb(err);
			}else{
			     encryptor.comparePassword(password, user.password, function (err, isMatch) {
				    if (err){
				    	err.message = 'Some Error occured while validating the encrypted password';
				    	ErrorManager(err,'Fatal Error','See Logs for more info');
				    	cb(err);
				    }else if(isMatch == true){
				    	var filteredUser = {
				    		username : user.username,
				    		password : user.password
				    	}
				    	cb(null, filteredUser);
					}else{
						var err = {};
						err.message = 'Authencation Failed';
						ErrorManager(err,'Authentication Failure','Incorrect password');
						cb(err,false);
					}
				});
			}
		})
	},
	getTasksOfUserByUsername : function(username,cb){
		this.getUser({'username':username},function(err,user){
			if(err)
				cb(err)
			else{
				cb(null,user.tasks);
			}
		})
	},
	getTasksCountByUsername : function(username,cb){
		this.getUser({
			'username' : username 
		},function(err,user){
			if(err){
				cb(err);
			}
			cb(null,user.tasksCount);
		})
	}

}

module.exports = UserController;

// UserController.getUsernamesByIds(['572b872461e183b832450978'],function(err,data){
// 	console.log(data);
// })


/**  Tests 
*	 Add these files to Test Files 
*/




// UserController.getTasksCountByUsername('ankurrana',function(err,a){
// 	console.log(a);
// })


// UserController.getTasksOfUserByUsername('ankur',function(err,data){
// 	console.log(data);
// })

// UserController.authenticateUser('ankur','ankur',function(err,asd){
// 	console.log(err);
// 	console.log(asd);
// })



// UserController.getUser({'username':'ankur'},function(err,user){
// 	if(err) console.log(err);
// 	console.log(user);
// })

// UserController.addTaskToUserByUsername('ankur rana','asdasjasfadklasd',function(err,asd){
// 	console.log(err);
// 	console.log(asd);
// })

// UserController.getUserByUsername('ankur',function(err,user){
// 	if(err) console.log(err);
// 	console.log(user);
// })

// UserController.addUser({
// 	'name' : 'Ankur Rana',
// 	'username' : 'Aana',
// 	'password' : 'saljafa',
// 	'email' : 'ankurji@gmail.com'
// },function(err,user){
// 	console.log(err);
// 	console.log(user);
// })

// UserController.authenticateUser('ankur','ankur',function(err,as){
// 	console.log(err);
// 	console.log(as);
// })


// UserController.addTaskToUserByUsername('ankur rana','kajhsfksaadalkfhas',function(err,mo){
// 	console.log(err);
// 	console.log(mo);
// })