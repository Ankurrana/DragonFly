var Task  = require('../models/Task.js')
var path = require('path');
var moment = require('moment');
var User = require('../models/User.js');
var UserController = require('./userController.js');
var ErrorManager = require('./ErrorController.js');
var validator = require('./validatorController.js');
var scheduleController = require('./scheduleController.js');


var TaskController = {
	getTask : function(taskId,cb){
		Task.findOne({'_id':taskId},function(err,task){
			if(err){
				err.message = 'Fatal Error';
				ErrorManager(err,'Fatal Error','Error while looking for the object Id' + taskId);
				cb(err)
			}
			else if(task == null){
				var err = {};
				err.message = 'No Task was found';
				ErrorManager(err,'Info','Task with object Id' + taskId + 'doesn\'t exist');
				cb(err,false);
			}else{
				cb(null,task);
			}
		})
	},
	getTasks : function(taskIds,cb){
		Task.find({'_id': { $in : taskIds }},function(err,data){
			if(err || data == null){
				err.message = 'There was a fatal error while retriving the tasks with Ids' + taskIds;
				ErrorManager(err,'Fatal Error','Fatal Error while retrieving tasks');
				cb(err);
			}else
				cb(null,data);
		})
	},
	addTask : function(task,username,cb){
		task.author = username;
		task.schedule = scheduleController.convertScheduleStringToLaterSchedule(task.schedule);
		if ( (err = validator.isTaskValid(task)) == true ){
			Task.addTask(task,function(err,task){
				if(err){
					err.message = 'Error while inserting task to database';
					ErrorManager(err);
					cb(err);
				}else{
					UserController.addTaskToUserByUsername(username,task._id,function(err,done){
						if(err){
							ErrorManager('Error while adding task to the user Task List');
							cb(err)
						}else{
							cb(null,{
								message : 'successfully Updated!'
							});
						}
					})
				}
			});
		}else{
			ErrorManager(err,'Validation Error');
			cb(err)
		}
	},
	getTasksForDate : function(taskIds,date,cb){
		/* It checks for all the tasks in the taskIds List and returns a list of tasks which satisfy the above date   */
		var result = [];
		this.getTasks(taskIds,function(err,tasks){
			if(err){
				cb(err);
			}else{
				for(var i in tasks){
					if(scheduleController.scheduleContainsDate(tasks[i].schedule,date)){
						result.push(tasks[i]);
					}
				}
				cb(null,result);
			}
		})
	},
	updateTask : function(taskId,taskUpdates,cb){
		Task.update({_id:taskId},{
			'description' : taskUpdates.description,
			'schedule' : scheduleController.convertScheduleStringToLaterSchedule(taskUpdates.schedule)
		},{multi : true},function(err,done){
			if(err){
				err.message = 'Error While Updating the task ' + taskId ;
				ErrorManager(err,'Task Not updated!');
				cb(err);
			}else{
				cb(null,{
					message : 'successfully Updated!'
				})
			}
		})
	}

}


module.exports = TaskController;

/*Tests*/


// UserController.getTasksOfUserByUsername('ankur',function(err,data){
// 	console.log(err);
// 	TaskController.getTasksForDate(data,'2016-03-06',function(err,data){
// 		console.log(err);
// 		console.log(data);
// 	});	
// })

// TaskController.updateTask('56d7ff0d82cd18fc1a5629f3',{
// 	description : 'UPDATED task',
// 	schedule : 'tomorrow'
// },function(err,asd){
// 	console.log(err);
// 	console.log(asd);
// })



// TaskController.addTask({
// 	'description' : 'qwerty',
// 	'author' : 'slkdkfur',
// 	'schedule' : 'asdasflhsf'
// },'ankur ranas',function(err,asd){
// 	console.log(err);
// 	console.log(asd);
// })



// TaskController.getTask('56dc154abced9b836367495',function(sda,asdasd){
// 	console.log(sda);
// 	console.log(asdasd);
// })