var later = require('later');
var moment = require('moment');

var generator;

/* This file provides generator functions for later.js schedules, these are stored in the database */
/*
	Generates Schedules for
	1.	Today
	2.	Tomorrow
	3.  This week
	4.  Next week
	5.	This Month
	6.	This year
	7.	On WeekEnds
	8. 	On WeekDays
	9   Every x date of the month
	10.	Every Monday/Tuesday... of the week. 
*/


var scheduleGenerator = function(description){
	/* Description is an object containing information on how to generate schedule */
	var schedule = later.parse.recur();
	console.log(moment().month());
	if(description == 'today'){
		var today = moment();
		schedule.on(today.date()).dayOfMonth().on(today.month()+1).month().on(today.year()).year();
	}else if(description == 'tomorrow'){
		var tomorrow = moment().add(1,'day');
		schedule.on(tomorrow.date()).dayOfMonth().on(tomorrow.month()+1).month().on(tomorrow.year()).year();
	}else if(description == 'week'){
		var today = moment();
		schedule.on(today.week()).weekOfMonth().on(today.year()).year();
	}else if(description == 'month'){
		var today = moment();
		schedule.on(today.month()+1).month().on(today.year()).year();	
	}
	return {
		schedules : schedule.schedules
	}
}

function contains(date,sch){
	/* If this date is included in the schedule */
	return later.schedule(sch).isValid(new Date(date));
}


module.exports = {
	'scheduleGenerator' : scheduleGenerator,
	'contains' : contains
}