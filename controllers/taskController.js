p:var Task  = require('../models/Task.js')
var path = require('path');
var moment = require('moment');
var User = require('../models/User.js');
var UserController = require('./userController.js');
var ErrorManager = require('./ErrorController.js');
var validator = require('./validatorController.js');
var scheduleController = require('./scheduleController.js');
var momentRange = require('moment-range')
var Comment = require('./commentController.js');

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
	getTaskByKey : function(taskKey,cb){
		Task.findOne({'key':taskKey},function(err,task){
			if(err){
				err.message = 'Fatal Error';
				ErrorManager(err,'Fatal Error','Error while looking for the object Id' + taskId);
				cb(err)
			}
			else if(task == null){
				var err = {};
				err.message = 'No Task was found';
				ErrorManager(err,'Info','Task with Task Key' + taskKey + 'doesn\'t exist');
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
	getTasksByKeys : function(taskKeys,cb){
		Task.find({'key': { $in : taskKeys }},function(err,data){
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

		UserController.getTasksCountByUsername(username,function(err,taskCount){
			task.key = username  + '-' + (taskCount+1);
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
									message : 'Success',
									success : true
								});
							}
						})
					}
				});
			}else{
				ErrorManager(err,'Validation Error');
				cb(err)
			}
		});
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
	getTasksForDateRange : function(taskIds,from,to,cb){
		var startDate = from;
		var endDate = to;
		if ( moment(startDate).isSameOrBefore(endDate) ){
			scheduleController.findDateRange(from,to,function(err,range){
				if(err){
					var error = {};
					error.message = 'Please check the date Range Selected!'
					cb(err)
				}else{
					TaskController.getTasks(taskIds,function(err,tasks){
						var resultTasks = [];
						for(var index = 0;index<range.length;index++){
							for(var j = 0;j<tasks.length;j++){
								// console.log(tasks[j].schedule);
								if(tasks[j]!=null){
									if(scheduleController.scheduleContainsDate(tasks[j].schedule,range[index])){
										// console.log(tasks[j]);				
										resultTasks.push( tasks[j] );
										tasks[j] = null;
									}
								}
							}
						}
						cb(null,resultTasks);

					})
				}
			})
		}else{
			 
			 var error = {};
			 error.message  = 'Start Date should be before or same as the end date';
			 cbb(err);
		}
	},
	updateTask : function(taskId,taskUpdates,cb){
		var Updates = {};
		if( taskUpdates.schedule ){
			Updates.schedule = scheduleController.convertScheduleStringToLaterSchedule(taskUpdates.schedule);
		}
		if( taskUpdates.description ){
			Updates.description = taskUpdates.description;
		}
		if( taskUpdates.status ){
			Updates.status = taskUpdates.status;
		}
		if( taskUpdates.completedAt ){
			Updates.completedAt = taskUpdates.completedAt;
		}
		console.log(taskUpdates.completedAt);	
			
		Task.update({_id:taskId},Updates,{multi : true},function(err,done){
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
	},
	updateTaskByKey : function(key,taskUpdates,cb){
		TaskController.getTaskByKey(key,function(err,task){
			TaskController.updateTask(task._id,taskUpdates,cb)
		})
	},
	addCommentToTaskByKey : function(key,username, commentString, cb){
		UserController.getUser({'username' : username },function(err,data){
			if(!err && data){
				var userId = data._id
				Comment.addComment({
					'description' :  commentString,
					'createdBy' : userId,
					'createdOn' : moment()
				},function(err,data){
					if(!err && data){
						var commentId = data._id;
						Task.getTaskByKey(key,function(err,data){
							if(!err && data){
								var taskId = data._id;
								Task.assignCommentToTask(taskId,commentId,function(err,data){
									if(err){
										cb(err)
									}else{
										cb(null,data);
									}
								})

							}else{
								cb(err);
							}
						})
					}else{
						cb(err)
					}
				})
			}else{
				cb(err);
			}
		})
	},
	getCommentsOfTaskByKey : function(key,cb){
		Task.find({'key':key},"comments",function(err,data){
			if(err || data == null){
				err.message = "No Task Found";
				cb(err);
			}
			Comment.getComments(data[0].comments,function(err,comments){
				cb(null,comments)
			})


		})
	}
}

// TaskController.addCommentToTaskByKey('ankurrana-4','ankurrana',function(err,data){
// 	console.log(rr);
// 	console.log(data);
// })
// TaskController.addCommentToTaskByKey('ankurrana-59','ankurrana','anewComment',function(err,data){
// 	console.log('asdsad');
// 	console.log(err);
// 	console.log(data);
// })



module.exports = TaskController;

/*Tests*/
// TaskController.getCommentsOfTaskByKey('ankurrana-59',function);



// TaskController.getTasksForDateRange('asdas','2016-03-01','2016-04-03',function(err,range){
// 	console.log(range);
// });

// TaskController.updateTaskByKey('ankurrana-4',{
// 	description : 'task with key - ankurrana-4 was updated to this description',
// 	schedule : 'today'
// },function(err,dasd){
// 	console.log(err);
// 	console.log(dasd);
// })


// UserController.getTasksOfUserByUsername('ankurrana',function(err,taskIds){
// 	TaskController.getTasksForDateRange(taskIds,'2016-03-20','2016-03-20',function(err,tasks){
// 		console.log(err);
// 		console.log(tasks);	
// 	})
// })




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


// var Person = function(name){
// 	this.name = name; 
// 	get
// }