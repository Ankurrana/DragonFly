var validator = require('validate.js');

validator.new_user_constraints = {
	'name' : {
		presence : true,
		length : {
			minimum : 6
		}
	},
	'username' : {
		presence : true,
		length : {
			minimum : 6
		}
	},
	'password' : {
		presence : true,
		length : {
			minimum : 6
		}
		
	},
	'email' : {
		presence : true,
		email : true
	}
}


validator.new_task_constraints = {
	'description' : {
		presence : true,
		length : {
			minimum : 5
		}
	},
	'author' : {
		presence : true
	},
	'schedule' : {
		presence : true
	}
}

validator.authorisation_credentials_constraints = {
	'username' : {
		presence : true,
		length : {
			minimum : 6
		}
	},
	'password' : {
		presence : true,
		length : {
			minimum : 6
		}
	} 
}


validator.areCredentialsValid = function(credentials){
	var error;
	if( (errors = validator(credentials,validator.authorisation_credentials_constraints)) == undefined ){
		return true
	}
	return errors;
}

validator.isUserValid = function(user){
	var error;
	if( (errors = validator(user,validator.new_user_constraints)) == undefined ){
		return true
	}
	return errors;
}

validator.isTaskValid = function(task){
	var error;
	if( (errors = validator(task,validator.new_task_constraints)) == undefined ){
		return true
	}
	return errors;	
}

module.exports = validator;