var errorMap = {
	'11000' : {
		type : 'Fatal',
		message : 'Duplicate key Entry',
		status : 400
	},
	'1' : {
		type : 'Fatal',
		message : 'Req Body Empty',
		status : 400
	}
	,
	'500' : {
		status : 200,
		message : 'Validation Error'
	},
	'3' : {
		status : 200,
		message : 'Authentication Failure'
	},
	'default' : {
		type : 'Unknown',
		message : 'An Unknown error has occured! Please try again later',
		status : 500
	},
}



module.exports = function(err,cb){
	var error = {};
	// var msg = (err.message!=null)?err.message:'No specific description provided!';
	if( err.code != null ) 
		error = errorMap[err.code]
	else
		error = errorMap['default'];
	
	cb(error);	
}


