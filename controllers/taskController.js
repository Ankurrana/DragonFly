var Task  = require('../models/Task.js')
var path = require('path');
var moment = require('moment');
var User = require('../models/User.js');
var laterHelper = require('../services/laterHelper.js');
var scheduleGenerator = laterHelper.scheduleGenerator;
var contains = laterHelper.contains;

var taskController = {
	'Get_new' : function(req,res){
		res.sendFile('newTask.html', { root: path.join(__dirname, '../public') });
	},
	'Post_new' : function(req,res){
			var formData = req.body;
			var schedule = scheduleGenerator(formData.schedule);
			console.log(schedule.schedules);
			var currentUser = (req.user != undefined)?req.user.username:'ankurrana';

			Task.addtask({
				'description' : formData.desc,
				'schedule' : schedule,
				'author' : currentUser,
				'assignedTo' : currentUser
			},function(err,data){
				if(err)
					res.json(err);
				else{
					User.assignTaskToUser(data._id,currentUser,function(err,data){
						if(err)
							console.log(err);
						else
							res.json(data);
					});					
				}
			})
	},
	Get_tasks : function(req,res){
		var currentUser = (req.user != undefined)?req.user.username:'ankurrana';
		
		User.findOne({'username':currentUser},'tasks',function(err,data){
			if(err) res.json(err); 	
			else{
				Task.getTasks(data.tasks,function(err,data){
					if(err) res.json(data)
					else{
						res.json(data);
					}
				})
			}
		})		
	},
	getTasksfordate : function(username,date,callback){
		/*	
			date format : yyyy-mm-dd
		*/

		User.findOne({'username':username},'tasks',function(err,data){
			if(err) res.json(err); 	
			else{
				Task.getTasks(data.tasks,function(err,tasks){
					var result = [];
					for(var i in tasks){
						if(contains(date,tasks[i].schedule)){
							result.push(tasks[i]);
						}
					}
					callback(result);
				})
			}
		})		
	}
}



taskController.getTasksfordate('ankurrana','2016-03-01',function(data){
	console.log(data);
})
module.exports = taskController;