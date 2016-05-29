var mongoose = require('./mongooseConnection.js');

var commentSchema = new mongoose.Schema({
	'description' : {
		type : String
	},
	'createdBy' : {
		type : mongoose.Schema.Types.ObjectId
	},
	'status' : {
		type : String,
		default : 'ACTIVE'
	},
	'createdOn' : {
		type : String,
		default : 'Date Not Updated!'
	}
},{
	timestamps : {
		createdAt : 'createdAt',
		updatedAt : 'updatedAt'
	}
});



commentSchema.statics.addComment = function(commentDetails,callback){
	var comment = new this({
		'description' : commentDetails.description,
		'createdBy' : commentDetails.createdBy,
		'createdOn' : commentDetails.createdOn
	});
	comment.save(function(err,data){
		if(err)
			 callback(err);
		else{
			callback(null,data);
		}
	});
}

commentSchema.statics.getCommentById = function(commentId,callback){
	Comment.findOne({'_id':commentId},'description createdBy createdOn',function(err,data){
		if(err)
			callback(err)
		else
			callback(null,data);
	})
}

commentSchema.statics.getCommentsById = function(commentIds,callback){
	Comment.find({'_id': { $in : commentIds }},'description createdBy createdOn',function(err,data){
		if(err)
			callback(err)
		else
			callback(null,data);
	})
}

var Comment =  mongoose.model('Comment',commentSchema);
module.exports = Comment;


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
