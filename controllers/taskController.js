var Task  = require('../models/Task.js')
var path = require('path');
var moment = require('moment');
var User = require('../models/User.js');
var Checkpoint = require('../models/Checkpoint.js');
var File = require('../models/Files.js');
var UserController = require('./userController.js');
var ErrorManager = require('./ErrorController.js');
var validator = require('./validatorController.js');
var scheduleController = require('./scheduleController.js');
var momentRange = require('moment-range')
var Comment = require('./commentController.js');
var RandomStringGenerator = require('randomstring');
var EmailController = require('./EmailController.js')
var EmailSender = require('../services/EmailSender.js');

var fs = require('fs');

var TaskController = {
	getTask : function(taskId,cb){
		Task.findOne({'_id':taskId}).populate('owner','username name').exec(function(err,task){
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
		Task.findOne({'key':taskKey})
			.select('-files.binaryData')
			.populate('owner','username name')
			.populate({
				path : 'comments',
				model : 'Comment',
			})
			.exec(function(err,task){


			console.log(task);
				
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
				/*
					Start Date of Task should always be more than or equal to the creation date of the task.
				*/
				var StartDate ;
				if( new Date(task.createdAt).valueOf() < new Date(scheduleController.startDate(task.schedule)).valueOf() ){
					StartDate = moment(new Date(scheduleController.startDate(task.schedule)));
				}else{
					StartDate = moment(new Date(task.createdAt));
					
				}
				var options = {
					path : 'comments.createdBy',
					model : 'User'
				}
				//  As of the system is fetching everything about the user.. we need just the username
				Task
				.populate(task,options,function(err,task2){
					// console.log(task2);
					task2.startDate = moment(StartDate).format("ddd, MMM Do YYYY");
					if(task2.status == "COMPLETED"){
						if(task2.completedAt){
							task2.completedAt = task.completedAt; 
						}else{
							task2.completedAt = task.updatedAt;
						}
						task2.completedAt = moment(task.completedAt).format("ddd, MMM Do YYYY");
					}else{
						task2.completedAt = undefined;
					}
					// foreach(task2.comments,function(comment){
					// 	comment.createdBy = comment.createdBy.name;
					// })

					// task2.comments.foreach(function(comment){
					// 	comment.createdBy = comment.createdBy.name;						
					// })

					cb(null,task2);
				})

				
			}
		})
	},
	getTasks : function(taskIds,cb){
		Task.find({'_id': { $in : taskIds }}).populate('owner','username name').exec(function(err,data){
			if(err || data == null){
				err.message = 'There was a fatal error while retriving the tasks with Ids' + taskIds;
				ErrorManager(err,'Fatal Error','Fatal Error while retrieving tasks');
				cb(err);
			}else
				cb(null,data);
		})
	},
	getTasksByKeys : function(taskKeys,cb){
		Task.find({'key': { $in : taskKeys }}).populate('owner','username name').exec(function(err,data){
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

		UserController.getIdByUsername(username,function(err,userId){
			task.key = RandomStringGenerator.generate();
			task.owner = userId;
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

								//EmailSender('ankurofficial@hotmail.com','A new Task Created!',task.description);
								//console.log('EMail Send!');
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
					
					// console.log("Created Date " + new Date(tasks[i].createdAt).valueOf());
					// console.log(new Date(date).valueOf());
					var isTaskCreatedAfterTheDate = new Date(tasks[i].createdAt).valueOf() - 24 * 60 * 60 * 1000  <  new Date(date).valueOf() ;
					
					if(isTaskCreatedAfterTheDate && scheduleController.scheduleContainsDate(tasks[i].schedule,date)){
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
				var username = data.username;
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

	addCheckpointToTask : function(key,checkpointString, cb){
		Task.getTaskByKey(key,function(err,data){
			if(!err && data){
				var taskId = data._id;
				Task.addCheckpointToTask(taskId,
					new Checkpoint({
						description : checkpointString
					}),
					function(err,data){
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
	}
	,
	getCommentsOfTaskByKey : function(key,cb){
		TaskController.getTaskByKey(key,function(err,data){
			if(err)
				cb(err)
			else{
				Comment.getComments(data.comments,function(err,comments){

					if(err){
						cb(err)
					}else{
						cb(null,comments);
					}
				})
			}
		})
	},
	deleteTaskByKey : function(key,cb){
		Task.findOne({'key':key},function(err,task){
			if(err){
				cb(err)
			}else{
				task.remove();
				cb(null,{
					message : 'Deleted Successfully'
				})
			}
		})
	},
	updateCheckpoint : function(key,_id, status,cb){
			Task.update({
				'key':key,
				'checkpoints._id' : _id
			},{
				$set : {
					'checkpoints.$.status' : status
				}
			},function(err,data){
				// console.log(data);
				if(!err)
					cb(null,data)
				else
					cb(err)
			})
	
	},
	searchTaskByDesc : function(username,searchkey,cb){
		// Search key is a string which shall be matched against the Tasks asigned to this particular user
		
		User
		.findOne({'username' : username})
		.select('_id')
		.exec(function(err,user){
			// console.log(username);
			Task.find({
				'owner' : user._id,
				'description' : new RegExp(searchkey,"i")
			})
			.sort({
				createdAt : -1
			})
			.populate('owner')
			.select('description key owner.name')
			.exec(function(err,data){
				// console.log(data);
				cb(err,data);
			})
		})	
	},

	addFileToTask : function(taskKey, file ,cb){
		Task.getTaskByKey(taskKey,function(err,data){
			if(!err && data){
				var taskId = data._id;

					 	// fs.writeFile('image_orig.png', original_data, 'binary', function(err) {});


			    var base64Image = fs.readFileSync(file.file)
			    // console.log("base64 str:");
			    // console.log(base64Image);
			    // console.log(base64Image.length);


			    Task.addFileToTask(taskId,
						new File({
							'filename' : file.filename,
							'binaryData' : base64Image
						}), 
						function(err,data){
							if(err){
								console.log(err);
								cb(err)
							}else{
								cb(null,data);
							}
						})

			 //    var decodedImage = new Buffer(base64Image, 'base64').toString('binary');
				// 	    console.log("decodedImage:");
				// 	    console.log(decodedImage);
				// 	    fs.writeFile('C:/image_decoded_text.txt', decodedImage, 'binary', function(err) {});
				
				// fs.readFile(file.file, function(err, data) {
				//   if (err) throw err;

				//   // Encode to base64
				//   console.log(encodedImage);

				//   var encodedImage = new Buffer(data,'binary').toString('base64');
				  
				
			}else{
				cb(err);
			}
		})
	}
,


	getFileOfTask : function(taskKey,File_id,cb){
		Task.aggregate([
		    { "$match": {
		        "key": taskKey
		    }},{
		    	'$unwind' : "$files"
		    },{
		    	'$match': {
		    		"files._id" : require('mongoose').Types.ObjectId(File_id)
		    	}
		    },{
		    	$project : {
		    		"files" : 1
		    	}
 		    }
		],function(err,result) {
				  // var decodedImage = new Buffer(encodedImage, 'base64').toString('binary');
			//console.log(new Buffer(result[0].files.binaryData,'base64').toString('binary'));

			if(!err){
				var file = {
					"binaryData" : result[0].files.binaryData.buffer,
					"filename" : result[0].files.filename
				} 

				var buffer = new Buffer(file.binaryData.buffer,'binary');
				var finalFile =  buffer.toString('utf8')

					cb(null,file);
			}else{
				cb(err);
			}
				
		})
	}


}


module.exports = TaskController;
