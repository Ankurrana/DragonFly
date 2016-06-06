var mongoose = require('./mongooseConnection.js');
var UserModel =  require('./User.js')

var commentSchema = new mongoose.Schema({
	'description' : {
		type : String
	},
	'createdBy' : {
		type : mongoose.Schema.Types.ObjectId,
		ref : 'User'
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
	// Comment.findOne({'_id':commentId},'description createdBy createdOn',function(err,data){
	// 	if(err)
	// 		callback(err)
	// 	else
	// 		callback(null,data);
	// })
	Comment.findOne({'_id':commentId},'description createdBy createdOn').lean().populate('createdBy','username').exec(function(err,data){
		if(err)
			callback(err)
		else
			callback(null,data);
	})
}

commentSchema.statics.getCommentsById = function(commentIds,callback){
	
Comment.find({'_id': { $in : commentIds }},'description createdBy createdOn').lean().populate('createdBy','username').exec(function(err,data){
		if(err)
			callback(err)
		else
			callback(null,data);
	})
}

var Comment =  mongoose.model('Comment',commentSchema);


// Comment.getCommentById('57405607b82503744a96e4f1',function(err,data){
// 	console.log(data);
// })

// Comment.getCommentsById(['57405607b82503744a96e4f1','57406d77b82503744a96e4f2'],function(err,data){
// 	console.log(data);
// })
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
