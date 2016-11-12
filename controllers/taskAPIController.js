var User = require('./userController.js');
var Task = require('./taskController.js');
var errorGenerator = require('../config/Errors/ErrorGenerator.js');
var validationController = require('./validatorController.js');
var GLOBALS = require('../config/GLOBALS.js');
var moment = require('moment');

var taskAPIController = {
	LoggedInUser : undefined,
	
	initialize : function(req,res,cb){
		if(!LoggedInUser)
			return;
		if(!req || !res){
			res.status(400).send('Bad Request');
		}
		if(!req.user.username){
			var error = {} ;
			error.message  = 'Unauthorized access';
			res.status(500).send('Error!');
		}else{
			this.loggedInUser = User.getUserByUsername(req.user.username,function(err,user){
				loggedInUser = user; 
			})
		}

	},
	getTaskForPeriod : function(req,res){
		var username = req.user.username;
		var date = req.query.date;
		if(!date ){
			date = moment(moment()).format('YYYY-MM-DD');
		}else{
			if( !moment(date).isValid()){
				res.send({
					err : {
						message : 'Date Format Invalid'
					}
				});
				return;
			}else{
				date = moment(date).format('YYYY-MM-DD');
			}
		}
		User.getTasksOfUserByUsername(username,function(err,taskIds){
			if(err){
				res.status(400).send(err);
			}else{
				Task.getTasksForDate(taskIds,date,function(err,tasks){
					res.send(tasks);
				})
			}
		})
	},	
	getTaskByKey: function(req,res){
		var key = req.params['key'];
		Task.getTaskByKey(key,function(err,data){
			if(err){
				res.status(400).send(err)
			}else{
				var task = {};
				task.description = data.description;
				task.status = data.status;
				task.author = data.author;
				task.owner = data.owner
				task.schedule = data.schedule;
				task.completedOn = data.completedOn;
				task.comments = data.comments;
				task.key = data.key
				task.checkpoints = data.checkpoints;
				task.startDate = data.startDate;
				res.send(task);
			}
		})
	},
	updateTaskByKey : function(req,res){
		var key = req.params['key'];
		var taskDetails = req.body;
		Task.updateTaskByKey(key, taskDetails,function(err,data){
			if(err){
				res.status(400).send(err)
			}else{
				res.send({
					'message' : 'Successfully Updated'
				})
			}
		})
	},
	deleteTaskByKey : function (req,res) {
		var key = req.params['key'];
		Task.deleteTaskByKey(key,function(err,data){
			if(err){
				res.status(400).send(err)
			}else{
				res.send({
					message : 'Successfully Deleted!'
				})
			}
		})
	},
	addTask : function(req,res){
		var username = req.user.username;
		if(req != null && req.body!=null){
			var taskDetails = req.body;
			Task.addTask(taskDetails,username,function(err,done){
				if(err){
					res.status(400).send(err)
				}else{
					res.send(done);
				}
			})
		}else{
			var error = {};
			error.code = 1;
			ErrorGenerator(error,function(err){
				res.status(400).send(err);
			})
		}
	},
	addCommentToTaskByKey : function(req,res){
		if( req && req.body ){
			var commentString  =  req.body.comment;
			var username = req.user.username;
			var TaskKey = req.params['key'];
			Task.addCommentToTaskByKey(TaskKey,username,commentString,function(err,data){
				if(!err)
					res.send(data);
				else
					res.status(400).send(err)
			})

		}
	},
	addCheckPointToTaskByKey : function(req,res){
		console.log(req.body.checkpoint);
		if(req && req.body){
			var checkpointString  =  req.body.checkpoint;
			var TaskKey = req.params['key'];
			Task.addCheckpointToTask(TaskKey,checkpointString,function(err,data){
				
				if(!err)
					res.send(data);
				else
					res.status(400).send(err)
			})
		}
	},
	updateCheckpoint : function(req,res){
		if(req && req.body){
			var checkPointId  =  req.body.id;
			var status = req.body.status;
			var key = req.body.key
			Task.updateCheckpoint(key,checkPointId,status,function(err,data){		
				if(!err)
					res.send(data);
				else
					res.status(400).send(err)
			})
		}
	},	
	getCommentsOfTaskByKey : function(req,res){
		if(req && req.body){
			var username = req.user.username;
			var taskKey = req.params['key'];
			Task.getCommentsOfTaskByKey(taskKey,function(err,data){
				if(!err && data){
					res.send(data);
				}else{
					if(data == null){
						var err = {};
						err.message = 'No Data recieved from the server'
					}
					res.status(400).send({
						'error' : err,
					})
				}
			})
		}
	},
	'shareTaskWithUsername' : function(req,res){
		var username = req.params['username'];
		var taskKey = req.params['key']
		Task.getTaskByKey(taskKey,function(err,data){
			if(err)
				res.send(err);
			else{
				var taskId = data._id;
				User.addTaskToUserByUsername(username,taskId,function(err,data){
					if(err)
						res.send(err)
					else{
						res.send(data);
					}
				})
			}
		})
	},
	'search' : function(req,res){
		var username = req.user.username;
		var taskKey = req.params['searchKey'];
		Task.searchTaskByDesc(username,taskKey,function(err,data){
			res.send(data);
		});
		
	}

}

module.exports = taskAPIController;