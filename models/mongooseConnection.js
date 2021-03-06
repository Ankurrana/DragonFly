/*
	This reads from the config.json file, connects to the database and returns the mongoose object 
	containing the connection.
	Excess db by 
	var mongoose = require('mongooseConnection.js');
	var db = mongoose.connection;

*/

var mongoose = require('mongoose');
var config  = require('./config.json');
// var EvennodeConfig = JSON.parse(process.env.APP_CONFIG);



if( process.env.PORT ){
  var connectionString = "mongodb://ankur:ankur123@ds013584.mlab.com:13584/dragonfly"
}else{
  var connectionString = "mongodb://" + config.hostname + "/" + config.database;
  //var connectionString = "mongodb://ankur:ankur123@ds013584.mlab.com:13584/dragonfly"
}
// console.log(connectionString);
// var connectionString = "mongodb://" + EvennodeConfig.mongo.user + ":ankur123@"+ EvennodeConfig.mongo.hostString;
mongoose.connect(connectionString,function(err){
	if(err) throw err;
});

mongoose.connection.on('connected', function () {  
  // console.log('Connected' );
}); 

// If the connection throws an error
mongoose.connection.on('error',function (err) {  
  console.log('Mongoose default connection error: ' + err);
}); 

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {  
  console.log('Mongoose default connection disconnected'); 
});

// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function() {  
  mongoose.connection.close(function () { 
    console.log('Mongoose default connection disconnected through app termination'); 
    process.exit(0); 
  }); 
}); 


module.exports = mongoose;



