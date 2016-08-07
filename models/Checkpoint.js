var mongoose = require('./mongooseConnection.js');
var UserModel = require('./User.js');

var checkpointSchema = new mongoose.Schema({
	'description' : {
		type : String,
		default : 'Default description'
	},
	'status' : {
		type : Boolean,
		default : 1
	}
},{
	timestamps : {
		createdAt : 'createdAt',
		updatedAt : 'updatedAt'
	}
});


checkpointSchema.statics.addCheckpoint = function(CheckpointDetails,callback){
	var checkpoint = new this({
		'description' : CheckpointDetails.description		
	});
	checkpoint.save(function(err,data){
		if(err)
			 callback(err);
		else{
			callback(null,data);
		}
	});
}

var Checkpoint =  mongoose.model('Checkpoint',checkpointSchema);
module.exports = Checkpoint;



// var ch = new Checkpoint({
// 	'description' : 'test Checkpoint'
// })

// ch.save(function(err,data){
// 	if(!err)
// 		console.log(data);
// });