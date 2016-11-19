var later = require('later');
var moment = require('moment');

var schedule = {
	complexScheduleParams : {
			"dayOfWeek" : {
				'name' : 'Day of Week',
				'frequency' : null,
				'values' : null,
				'functionName' : 'dayOfWeek'
			},
			"dayOfMonth" : {
				'name' : 'Day of Month',
				'frequency' : null,
				'values' : null,
				'functionName' : 'dayOfMonth'
			},
			"weekOfMonth" : {
				'name' : 'Week Of Month',
				'frequency' : null,
				'values' : null,
				'functionName' : 'weekOfMonth'
			},
			"weekOfYear" : { 
				'name' : 'Week Of Year',
				'frequency' : null,
				'values' : null,
				'functionName' : 'weekOfYear'
			},
			"month" : {
				'name' : 'Month',
				'frequency' : null,
				'values' : null,
				'functionName' : 'month'
			},
			"year" : {
				'name' : 'Year',
				'frequency' : null,
				'values' : null,
				'functionName' : 'year'
			},
		},
		getScheduleStringForComplexSchedule : function(){
			var laterSchedule = later.parse.recur();

			for( var param in this.complexScheduleParams){
				if( this.complexScheduleParams.hasOwnProperty(param)){
					param = this.complexScheduleParams[param];
					console.log("%o",param);
					if( param.values ){
						var valArray = param.values.split(",");
						var fre = "on";
						valArray.forEach(function(value, key){
							var range = value.split('-');
							var start,end;
							if(range.length == 2){
								start = parseInt(range[0]);
								end = parseInt(range[1]);
							}else{
								start = parseInt(range[0]);
								end = parseInt(range[0]);
							}	
							
							for(var i = start;i<=end;i++) 
								laterSchedule[fre](i)[param.functionName]();
						})
					}
				}
			}

			
			// this.complexScheduleParams.forEach(function(param){
			// 	console.log("Object %o",this.complexScheduleParams)
			// 	if( param.values ){
			// 		var valArray = param.values.split(",");
			// 		var fre = param.frequency;
			// 		angular.forEach(valArray,function(value, key){
			// 			var range = value.split('-');
			// 			var start,end;
			// 			if(range.length == 2){
			// 				start = parseInt(range[0]);
			// 				end = parseInt(range[1]);
			// 			}else{
			// 				start = parseInt(range[0]);
			// 				end = parseInt(range[0]);
			// 			}	
						
			// 			for(var i = start;i<=end;i++) 
			// 				laterSchedule[fre](i)[param.functionName]();
			// 		})
			// 	}
			// })
			// var nextNDaysFunc = function(schedule,n){
			// 	for(var i=0;i<n;i++){
			// 		var day = moment().add(i,'day');
			// 		// schedule = schedule.and();
			// 		schedule.on(day.date()).dayOfMonth().on(day.month()+1).month().on(day.year()).year()
			// 		if( i+1 < n )
			// 			schedule.and();
			// 	}
			// 	return schedule;
			// }	


			// if( this.nextNDays ){
			// 	console.log('Next N days is selected!');
			// 	laterSchedule = nextNDaysFunc(laterSchedule,parseInt(this.nextNDays));
			// }			
			return JSON.stringify(laterSchedule.schedules);
		},
	
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
			schedule.on(today.isoWeek()).weekOfYear().on(today.year()).year();
		}else if(description == 'month'){
			var today = moment();
			schedule.on(today.month()+1).month().on(today.year()).year();	
		}else{
			// Here check instead of scheduledescription , we need a stringyfied JSON Object. We need the following JSON Object : 

			/* dda
			*	dayOfWeek : Value
			*	dayOfMonth : Value
			*	WeekOfMonth : Value
			*	weekOfYear : Value
			*	Month : Value
			*	Year : Value	
			*/
		
			
			var JSONObject =  JSON.parse(description);	
			console.log(JSONObject["dayOfWeek"]);
			this.complexScheduleParams["dayOfWeek"].values =  JSONObject["dayOfWeek"];
			this.complexScheduleParams["dayOfMonth"].values =  JSONObject["dayOfMonth"];
			this.complexScheduleParams["weekOfMonth"].values =  JSONObject["weekOfMonth"];
			this.complexScheduleParams["weekOfYear"].values =  JSONObject["weekOfYear"];
			this.complexScheduleParams["month"].values =  JSONObject["month"];
			this.complexScheduleParams["year"].values =  JSONObject["year"];
			console.log("My Obj %o",this.complexScheduleParams);
			description = this.getScheduleStringForComplexSchedule();
			console.log("THis is the description : " , description);
			schedule.schedules  = JSON.parse(description);
		}
		return {
			schedules : schedule.schedules
		}
	},
	scheduleContainsDate : function(schedule,date){
		/* date : 'YYYY-MM-DD' */

		// console.log("My Obj %o", schedule.schedules);
		return later.schedule(schedule).isValid(new Date(date));
	},
	startDate : function(schedule){
		return moment(new Date(later.schedule(schedule).next(1,new Date('2000-01-01'))));
	}
	,
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



// var today = new Date("May 25, 2016");
// var tomorrow = new Date("May 26, 2016");
// var romorrow = new Date("May 27, 2016")
// var schedule = 

// later.parse.recur()
// .on(25).dayOfMonth().on(5).month().on(2016).year()
// .and()
// .on(26).dayOfMonth().on(5).month().on(2016).year()
// .and()
// .on(27).dayOfMonth().on(5).month().on(2016).year()

// var sched = later.schedule(schedule);
// var ans = sched.isValid(new Date('2016-05-27'));
// console.log(ans);
// console.log(ans)
  // --> false

  // sched.isValid(new Date('2013-03-22T10:02:05Z'));
  // --> false


/* attaches  a later schedule for the next n days*/
// var nextNDays = function(schedule,n){
// 	for(var i=0;i<n;i++){
// 		var day = moment().add(i,'day');
// 		schedule = schedule.and();
// 		schedule.on(day.date()).dayOfMonth().on(day.month()+1).month().on(day.year()).year()
// 	}
// 	return schedule;
// }	


// var schedule =  {
//         "schedules" : [ 
//             {
//                 "Y" : [ 
//                     2016
//                 ],
//                 "wy" : [ 
//                     19
//                 ]
//             }
//         ]
//     }

// // // var k = later.schedule(schedule).isValid(new Date('2016-05-02'));
// var k = later.schedule(schedule).next(1,new Date('2006-05-02'));

// console.log(k);


// var k = later.parse.recur()["on"](5,6,7).dayOfWeek();
// // k.on(2016).year();
// console.log(k.schedules);