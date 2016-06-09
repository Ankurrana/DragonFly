var Comment  = require('../models/Comment.js')
var path = require('path');
var moment = require('moment');
var User = require('../models/User.js');
var UserController = require('./userController.js');
var ErrorManager = require('./ErrorController.js');
var validator = require('./validatorController.js');
var momentRange = require('moment-range')


var CommentController = {
	getComment : function(commentId,cb){
		Comment.findOne({'_id':commentId}).populate('createdBy','name username -_id').exec(function(err,Comment){
			if(err){
				err.message = 'Fatal Error';
				ErrorManager(err,'Fatal Error','Error while looking for the object Id' + commentId);
				cb(err)
			}
			else if(Comment == null){
				var err = {};
				err.message = 'No Comment was found';
				ErrorManager(err,'Info','Comment with object Id' + commentId + 'doesn\'t exist');
				cb(err,false);
			}else{
				cb(null,Comment);
			}
		})
	},
	getComments : function(commentIds,cb){
		Comment.find({'_id': { $in : commentIds }}).populate('createdBy','name username -_id')
		.sort('-createdAt')
		.exec(function(err,data){
			if(err || data == null){
				err.message = 'There was a fatal error while retriving the tasks with Ids' + commentIds;
				ErrorManager(err,'Fatal Error','Fatal Error while retrieving tasks');
				cb(err);
			}else{
				cb(null,data);
			}
		})
	},
	addComment : function(commentDetails,cb){
		Comment.addComment(commentDetails,function(err,data){
			if(err){
				cb(err)
			}else{

				cb(null,data);
			}
		})
	}
}



module.exports = CommentController;