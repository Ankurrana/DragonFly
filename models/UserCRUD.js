var mongoose =  require('./mongooseConnection');
var User = require("./UserModel.js");

/*
	This module just adds and retrives the values of the database. All validations and processing 
	must be done before and after.
*/

function addUser(UserData,callback){
	var user = new User({
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

function getUser(userEmail,callback){
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
