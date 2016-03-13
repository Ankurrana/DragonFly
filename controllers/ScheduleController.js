var later = require('later');
var moment = require('moment');

var schedule = {
	convertScheduleStringToLaterSchedule : function(description){
		var schedule = later.parse.recur();
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
		}else{
			var today = moment();
			schedule.on(today.date()).dayOfMonth().on(today.month()+1).month().on(today.year()).year();
		}
		return {
			schedules : schedule.schedules
		}
	},
	scheduleContainsDate : function(schedule,date){
		/* date : 'YYYY-MM-DD' */
		return later.schedule(schedule).isValid(new Date(date));
	}
}

module.exports = schedule;