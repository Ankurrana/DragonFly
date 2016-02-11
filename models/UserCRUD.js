var mongoose =  require('./mongooseConnection');
var User = require("./UserModel.js");
var encryption = require('../services/bcrypt.js'); 

/*
	This module just adds and retrives the values of the database. All validations and processing 
	must be done before and after.
*/

function addUser(UserData,callback){
	var encryptedPassword = encryption.cryptPasswordSync(UserData.password);
	var user = new User({
		"name" : UserData.name,
		"password" : encryptedPassword,
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

function validateUserById(userId,UserEnteredPassword,callback){
	User.findById(userId,"password -_id",function(err,doc){
		var pass = doc.password;
		if(err) callback(err);
		if( encryption.comparePasswordSync(UserEnteredPassword,pass) == true ){
			callback(null,true);
		}else{
			callback(null,false);
		}
	})
}


function validateUserByEmail(userEmail,UserEnteredPassword,callback){
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

module.exports = {
	"addUser" : addUser,
	"validateUserById" : validateUserById,
	"getUser" : getUser,
	"validateUserByEmail" : validateUserByEmail
}


// validateUser("56ab56d2993d36f8187de0bd","A93nku@Ana",function(err,res){
// 	console.log(res);
// });


// addUser({
// 	"name" : "Ankurrana",
// 	"password" : "A93nku@Ana",
// 	"username" : "Ankur",
// 	"email" : "ankur@hotmail.com"
// },function(err){
// 	if(err)
// 		console.log(err);
// });

