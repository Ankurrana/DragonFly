var mongoose = require('./mongooseConnection.js');

var taskSchema = new mongoose.Schema({
	description : {
		type : String
	},
	childrens : {
		type : Array
	},
	parent : {
		type: mongoose.Schema.Types.ObjectId
	},
	status : {
		type : String,
		enum : ['NEW','DRAFT','POSTPONED','CLOSED','COMPLETED','IN PROGRESS'],
		default : 'NEW'
	},
	AssignedToDate : {
		type : Date
		default : Date.now
	},
	createdBy : {
		type : mongoose.Schema.Types.ObjectId,
	},
	createdFor : {
		type : mongoose.Schema.Types.ObjectId,
	},
	schedule : {
		
	}

},{
	timestamps : {
		createdAt : 'createdAt',
		updatedAt : 'updatedAt'
	}
});


var Task =  mongoose.model('Task',taskSchema);
module.exports = Task;


var task = new Task({
	description : "Bla Bla Black Sheep!"
})

task.save(function(err){
	if(err)
			console.log(err);
	else{
		console.log('done!');
	}
})
