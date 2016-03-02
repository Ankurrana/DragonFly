/** 
*	This function taskes schedule as an input ans returns a javascript object with format : 
*	{
*		'yyyy-mm-dd' : ObjectId(hhhhh),
*		'yyyy-mm-dd' : ObjectId(hhhhh)..
*	}	
*
*
*/
var later = require('later');
var moment = require('moment');
var scheduleGenerator = require('./scheduleGenerator.js');

var generator = function(scheduleDefinition){
	var schedule = later.schedule(scheduleDefinition).next(100);
	return schedule;
}
module.exports = generator;

console.log(generator(scheduleGenerator('year')));