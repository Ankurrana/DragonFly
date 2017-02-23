var mongoose = require('./mongooseConnection.js');
var UserModel = require('./User.js');

var FilesSchema = new mongoose.Schema({
	'binaryData' : {
		type : Buffer
	},
	'filename' : {
		type : String
	}
},{
	timestamps : {
		createdAt : 'createdAt',
		updatedAt : 'updatedAt'
	}
});


FilesSchema.statics.addFile = function(fileDetails,callback){
	var file = new this({
		'binaryData' : fileDetails.binaryData		
	});
	file.save(function(err,data){
		if(err)
			 callback(err);
		else{
			callback(null,data);
		}
	});
}

var File =  mongoose.model('File',FilesSchema);
module.exports = File;	



// var ch = new Checkpoint({
// 	'description' : 'test Checkpoint'
// })

// ch.save(function(err,data){
// 	if(!err)
// 		console.log(data);
// });