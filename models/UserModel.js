var mongoose = require('./mongooseConnection.js');

var UserSchema = new mongoose.Schema({
	name : {
		type : String
	},
	email : {
		type : String,
		unique : true
	},
	password : {
		type : String
	},
	username : {
		type : String,
		unique : true
	}
});

var userModel =  mongoose.model('User',UserSchema);
module.exports = userModel;