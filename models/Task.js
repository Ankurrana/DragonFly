var mongoose = require('./mongooseConnection.js');

var taskSchema = new mongoose.Schema({
	'description' : {
		type : String,
		default : 'Default description'
	},
	'status' : {
		type : String,
		enum : ['ACTIVE','INPROGRESS','DELETED','DONE','CLOSED'],
		default : 'ACTIVE'
	},
	'author' : {
		type : String
	},
	'schedule' : {
		type : Object
	},
	'key' : {
		type : String
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
	Task.findOne({'_id':taskId},'description status schedule author',function(err,data){
		if(err)
			callback(err)
		else
			callback(null,data);
	})
}

taskSchema.statics.getTasksById = function(taskIds,callback){
	Task.find({'_id': { $in : taskIds }},'description status schedule author key',function(err,data){
		if(err)
			callback(err)
		else
			callback(null,data);
	})
}

taskSchema.statics.getTaskByKey = function(taskKey,callback){
	Task.findOne({'key' : taskKey},'-_id',function(err,data){
		if(err) callback(err);
		else
			callback(null, data);

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
