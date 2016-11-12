var mongoose = require('./mongooseConnection.js');
var UserModel = require('./User.js');
var CheckPointModel = require('./Checkpoint.js');

var taskSchema = new mongoose.Schema({
	'description' : {
		type : String,
		default : 'Default description'
	},
	'status' : {
		type : String,
		enum : ['ACTIVE','INPROGRESS','DELETED','DONE','CLOSED','COMPLETED'],
		default : 'ACTIVE'
	},
	'author' : {
		type : String
	},
	'owner' : {
		type : mongoose.Schema.Types.ObjectId,
		ref : 'User'
	}
	,
	'schedule' : {
		type : Object
	},
	'scheduleDates' : {
		type : [{
			'Date' : Date,
			'Completed' : Boolean
		}]
	},
	'key' : {
		type : String
	},
	'completedAt' : {
		type : String 
	},
	'comments' : {
		type : [String],
		default : []
	},
	'checkpoints' : {
		type : [CheckPointModel.schema]
	}
},{
	timestamps : {
		createdAt : 'createdAt',
		updatedAt : 'updatedAt'
	}
});

taskSchema.statics.addTask = function(taskDetails,callback){
	var task = new this({
		'description' : taskDetails.description,
		'schedule' : taskDetails.schedule,
		'author' : taskDetails.author,
		'owner' : taskDetails.owner,
		'key' : taskDetails.key,
		'completedAt' : taskDetails.completedAt
	});
	task.save(function(err,data){
		if(err)
			 callback(err);
		else{
			callback(null,data);
		}
	});
}

taskSchema.statics.getTaskById = function(taskId,callback){
	Task.findOne({'_id':taskId},'description status schedule author owner key completedAt',function(err,data){
		if(err)
			callback(err)
		else
			callback(null,data);
	})
}

taskSchema.statics.getTasksById = function(taskIds,callback){
	Task.find({'_id': { $in : taskIds }},'description status schedule owner author key completedAt',function(err,data){
		if(err)
			callback(err)
		else
			callback(null,data);
	})
}

taskSchema.statics.getTaskByKey = function(taskKey,callback){
	Task.findOne({'key' : taskKey},function(err,data){
		if(err) callback(err);
		else
			callback(null, data);

	})
}

taskSchema.statics.assignCommentToTask = function(task_id,comment_id,callback){
	
	Task.findOne({_id:task_id},"comments",function(err,doc){
		if(err)
			callback(err);		
		var comments = doc.comments;

		comments.push(comment_id);
		Task.update({_id:doc._id},{
			$set : {
				'comments' : comments
			}
		},{},function(err,data){
			if(err)
				callback(err)
			else
				callback(null,data);
		})
	})
}

taskSchema.statics.addCheckpointToTask = function(task_id,checkpoint,callback){
	Task.findOne({_id:task_id},"",function(err,doc){
		if(err)
			callback(err);		
		doc.checkpoints.push(checkpoint)
		doc.save(function(err,data){
			if(err)
				callback(err)
			else
				callback(null,{
					'success' : 'Checkpoint Added Successfully'
				})

		});
	})


}


var Task =  mongoose.model('Task',taskSchema);
module.exports = Task;


// var task = new Task({
// 	description : "Bla Bla Black Sheep!",
// 	'schedule' : {
// 		    schedules:
// 		      [
// 		        {d: [27]},
// 		      ]
// 		  }

// })

// task.save(function(err){
// 	if(err)
// 			console.log(err);
// 	else{
// 		console.log('done!');
// 	}
// })
