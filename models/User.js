var mongoose = require('./mongooseConnection.js');
var encryption = require('../services/bcrypt.js');

function encrypt(val){
	return encryption.cryptPasswordSync(val);
}

var userSchema = new mongoose.Schema({
	'name' : {
		type : String
	},
	'email' : {
		type : String,
		unique : true,
		lowercase : true
	},
	'password' : {
		type : String,
		set : encrypt
	},
	'username' : {
		type : String,
		unique : true,
		lowercase : true
	},
	'tasks' : {
		type : Array,
		default : []
	},
	'tasksCount' : {
		type : Number,
		Default : 0
	},
	'groupAccess' :[{type:mongoose.Schema.Types.ObjectId, ref :'User'}]
});


userSchema.statics.addUser = function addUser(UserData,callback){
	var user = new this({
		"name" : UserData.name,
		"password" : UserData.password,
		"email" : UserData.email,
		"username" : UserData.username,
		'tasksCount' : 0 
	});
	user.save(function(err,data){
		if(err){
			// console.log(err);
			callback(err);
		}else
			callback(null,data);
	});
}


userSchema.statics.assignTaskToUser = function assignTaskToUser(user_id,task_id,callback){
	User.findOne({_id:user_id},"tasks tasksCount",function(err,doc){
		if(err)
			callback(err);		
		var tasks = doc.tasks;
		var tasksCount = doc.tasksCount;

		tasks.push(task_id);
		User.update({_id:doc._id},{
			$set : {
				'tasks' : tasks,
				'tasksCount' : tasksCount + 1	
			}
		},{},function(err,data){
			if(err)
				callback(err)
			else
				callback(null,data);
		})
	})
}

userSchema.methods.comparePassword = function (passw, cb) {
    encryption.comparePassword(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};



userSchema.statics.assignUserGroupToUser = function assignUserGroup(user_id,userGroup_id,callback){
	User.findOne({_id:user_id},"groupAccess",function(err,doc){
		if(err)
			callback(err);		
		var userGroups = doc.groupAccess;

		tasks.push(task_id);
		User.update({_id:doc._id},{
			$set : {
				'tasks' : tasks,
				'tasksCount' : tasksCount + 1	
			}
		},{},function(err,data){
			if(err)
				callback(err)
			else
				callback(null,data);
		})
	})
}




var User =  mongoose.model('User',userSchema);
module.exports = User;


