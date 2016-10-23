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
	'userGroups' :[{type:mongoose.Schema.Types.ObjectId, ref :'usersGroupSchema'}]
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





var User =  mongoose.model('User',userSchema);


// User.addUserGroupToUser("57488fd34305763c4155ab24","57f8bbc4b253db0c29236c14",function(err,data){
// 	console.log(data);
// })
module.exports = User;


