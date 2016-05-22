var validator = require('validate.js');

validator.new_user_constraints = {
	'name' : {
		presence : true,
		length : {
			minimum : 1
		}
	},
	'username' : {
		presence : true,
		length : {
			minimum : 1
		}
	},
	'password' : {
		presence : true,
		length : {
			minimum : 3
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
			minimum : 1
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
			minimum : 1
		}
	},
	'password' : {
		presence : true,
		length : {
			minimum : 1
		}
	} 
}

validator.edit_task_constraints = {
	'description' : {
		presence : true,
		length : {
			minimum : 3
		}
	},
	'schedule' : {
		presence : true,
	}
}

validator.new_comment_constraints = {
	'comment' : {
		presence : true,
		length : {
			minimum : 3
		}
	}
}

validator.isCommentValid = function(comment){
	var errors;
	if( (errors = validator(comments,validator.new_comment_constraints)) == undefined ){
		return true
	}
	return errors;
}

validator.areEditTaskDetailsValid = function(taskDetails){
	var error;
	if( (errors = validator(taskDetails,validator.edit_task_constraints)) == undefined ){
		return true
	}
	return errors;
}

validator.isDateValid = function(Object){
	return validator.isDate(Object);
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