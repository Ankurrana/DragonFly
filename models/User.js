var mongoose = require('./mongooseConnection.js');
var encryption = require('../services/bcrypt.js');

function encrypt(val){
	return encryption.cryptPasswordSync(val);
}

var userSchema = new mongoose.Schema({
	name : {
		type : String
	},
	email : {
		type : String,
		unique : true,
		lowercase : true
	},
	password : {
		type : String,
		set : encrypt
	},
	username : {
		type : String,
		unique : true
	}
});



userSchema.statics.addUser = function addUser(UserData,callback){
	var user = new this({
		"name" : UserData.name,
		"password" : UserData.password,
		"email" : UserData.email,
		"username" : UserData.username 
	});
	user.save(function(err){
		if(err)
			 callback(err);
		else
			callback(null);
	});
}

userSchema.statics.validateUserByEmail = function validateUserByEmail(userEmail,UserEnteredPassword,callback){
	User.findOne({email:userEmail},"username email password",function(err,doc){
		if(err) 
			callback(err);
		if(doc == null){
			return callback(null,false,{err:1,errCode:3,'errMsg':"No User Found"});
		}
		var pass = doc.password;
		if( encryption.comparePasswordSync(UserEnteredPassword,pass) == true ){
			return callback(null,doc);
		}else{
			return callback(null,false,{"err":1,errCode:2,"errMsg":"Not Validated"});
		}
	})
}


userSchema.statics.getUser = function getUser(userEmail,callback){
	User.findOne({"email":userEmail},"name username email",function(err,user){
		if(err){
			callback(err);
		}else{
			if( user!= null )
				callback(null,user);
			else
				callback(null,{"err":1,"errCode":1,"errMsg":"No User Found!"});
		}
	})
}

userSchema.statics.getAllUsers = function getAllUsers(callback){
	User.find({},'username name email',function(err,data){
		if(err)
			callback(err)
		else
			callback(null,data);
	})
}


userSchema.statics.getUserByUsername = function getUserByUsername(username,callback){
	User.findOne({"username":username},"-_id -password",function(err,user){
		if(err)
			callback(err)
		if(!user)
			callback(null,false)
		else
			callback(null,user);
	})
} 

var User =  mongoose.model('User',userSchema);
module.exports = User;


