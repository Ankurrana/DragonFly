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
	'assignedTo' : {
		type : String
	},
	'schedule' : {
		type : Object
	}
},{
	timestamps : {
		createdAt : 'createdAt',
		updatedAt : 'updatedAt'
	}
});


taskSchema.statics.addtask = function(taskDetails,callback){
	var task = new this({
		'description' : taskDetails.description,
		'schedule' : taskDetails.schedule,
		'author' : taskDetails.author,
		'assignedTo' : taskDetails.assignedTo
	});
	task.save(function(err,data){
		if(err)
			 callback(err);
		else{
			callback(null,data);
		}
	});
}

taskSchema.statics.getTask = function(taskId,callback){
	Task.findOne({'_id':taskId},'description status schedule author',function(err,data){
		if(err)
			callback(err)
		else
			callback(null,data);
	})
}

taskSchema.statics.getTasks = function(taskIds,callback){
	Task.find({'_id': { $in : taskIds }},'description status schedule author',function(err,data){
		if(err)
			callback(err)
		else
			callback(null,data);
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
