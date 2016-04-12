ar Task  = require('../models/Task.js')
var path = require('path');
var moment = require('moment');
var User = require('../models/User.js');
var laterHelper = require('../services/laterHelper.js');
var scheduleGenerator = laterHelper.scheduleGenerator;
var contains = laterHelper.contains;

var taskController = {
	'Get_new' : function(req,res){
		res.render('newTask',{desc :'write a description',status:'active'})
		// res.sendFile('newTask.html', { root: path.join(__dirname, '../public') });
	},
	'Post_new' : function(req,res){
			var formData = req.body;
			var schedule = scheduleGenerator(formData.schedule);
			console.log(schedule.schedules);
			var currentUser = (req.user != undefined)?req.user.username:'ankurrana';
			
			User.getUserByUsername(currentUser,function(err,data){
				var tasksCount = data.tasksCount + 1;
				Task.addtask({
					'description' : formData.desc,
					'schedule' : schedule,
					'author' : currentUser,
					'assignedTo' : currentUser,
					'key' : currentUser + '-' + tasksCount 
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
			})
			
	},
	Get_tasks : function(req,res){
		var currentUser = (req.user != undefined)?req.user.username:'ankurrana';
		
		User.findOne({'username':currentUser},'tasks',function(err,data){
			if(err) res.json(err); 	
			else{
				Task.getTasksById(data.tasks,function(err,data){
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
			if(err) callback(err); 	
			else{
				Task.getTasksById(data.tasks,function(err,tasks){
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
	},
	Get_getTaskByKey : function(req,res){
		Task.getTaskByKey(req.key,function(err,data){
			if(err) callback(err);
			else{
				res.json(data);
			}
		})
	},
	Get_UpdateTask : function(req,res){
		Task.getTaskByKey(req.key,function(err,data){
			if(err) callback(err);
			else{
				res.render('newTask',{desc:data.description,'action':'',key:req.key,status:data.status});
			}
		})
	},
	Post_UpdateTask : function(req,res){
		var formData = req.body;
		console.log(formData);
		if(formData.schedule != null)
			sch = scheduleGenerator(formData.schedule);			

		if(formData.desc != null || formData.schedule != null  ){
			Task.update({key:formData.key},{
				description : formData.desc,
				status : formData.status,
				schedule : sch,
			},function(err,doc){
				if(err) res.status(500).send('Server Error');
				else
					res.json('successfully Updated!');
			})
		}else{
			Task.update({key:formData.key},{
				status : formData.status,
			},function(err,doc){
				if(err) res.status(500).send('Server Error');
				else
					res.json('successfully Updated!');
			})
		}
	}
}


module.exports = taskController;