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
		// initialize(req,res);
		var username = req.user.username;
		var date = req.query.date;
		if(!date ){
			date = moment(moment()).format('YYYY-MM-DD');
		}else{
			if( !moment(date).isValid()){
				res.send('error');
				return;
			}else{
				date = moment(date).format('YYYY-MM-DD');
				console.log(date);
			}
		}
		User.getTasksOfUserByUsername(username,function(err,taskIds){
			if(err){
				res.send(err);
			}else{
				Task.getTasksForDate(taskIds,date,function(err,tasks){
					res.send(tasks);
				})
			}
		})


	},	
	getTaskByKey: function(req,res){
		var key = req.params['key'];
		key = req.user.username + '-' + key;
		Task.getTaskByKey(key,function(err,data){
			if(err){
				res.send(err)
			}else{
				var task = {};
				task.description = data.description;
				task.status = data.status;
				task.author = data.author;
				task.schedule = data.schedule;
				res.send(task);
			}
		})
	},
	addTask : function(req,res){
		var username = req.user.username;
		if(req != null && req.body!=null){
			var taskDetails = req.body;
			Task.addTask(taskDetails,username,function(err,done){
				if(err){
					res.send(err)
				}else{
					res.send(done);
				}
			})
		}else{
			var error = {};
			error.code = 1;
			ErrorGenerator(error,function(err){
				res.send(err);
			})
		}
	}	
}

module.exports = taskAPIController;