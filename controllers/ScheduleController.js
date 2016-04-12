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
	},
	findDateRange : function(startDate,endDate,cb){
		if( moment(startDate).isValid()  && moment(endDate).isValid() ){
			from_Date = moment(startDate).format('YYYY-MM-DD');
			to_Date = moment(endDate).format('YYYY-MM-DD');
			var dateRange = [];
			dateRange.push(from_Date);

			if( from_Date == to_Date ){
				cb(null,dateRange);
				return;
			}
			var count = 0;
			while(true){
				if(count++ > 200 ) 
					break;
				from_Date = moment(from_Date).add(1,'days').format('YYYY-MM-DD');
				dateRange.push(from_Date);
				if(from_Date == to_Date){
					break;
				}
			}
			cb(null,dateRange);
		}else{	
			var error = {};
			error.message = 'Date Format Incorrect , please provide YYYY-MM-DD';
			cb(error);
		}
	}
}

module.exports = schedule;