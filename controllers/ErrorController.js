var logger = require('./logController.js');

var ErrorManager = function(_errorObject,type,message){
	var k = {};
	k.errorObject = _errorObject;
	k.type = type || 'info';
	k.message = message || 'Look into Logs for info';
	// logger.info(JSON.stringify(k));
	console.log(k);
}

module.exports = ErrorManager;