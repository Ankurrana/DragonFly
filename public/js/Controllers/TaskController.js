app.controller('taskController',['$scope','$http','$cookies','$resource','$rootScope','Task',function($scope,$http,$cookies,$resource,$rootScope,Task){
	$scope.viewTasksURL = "public/views/tasksList.html";
	$scope.tasks = [];
	$scope.showComplesScheduleCreator = false;


	$scope.newTaskForm = {
		nextNDays : undefined,
		scheduleOptions : [
			{
				'label' : 'Today',
				'value' : 'today'
			},
			{
				'label' : 'Tomorrow',
				'value' : 'tomorrow'	
			},
			{
				'label' : 'Current Week',
				'value' : 'week'
			},
			{
				'label' : 'Current Month',
				'value' : 'month'
			},
			{
				'label' : 'Complex',
				'value' : 'complex'
			}
		],
		selectedSchedule : null,
		description : null,
		showComplexScheduleCreator : false,
		complexScheduleParams : [
			{
				'name' : 'Day of Week',
				'frequency' : null,
				'values' : null,
				'functionName' : 'dayOfWeek'
			},
			{
				'name' : 'Day of Month',
				'frequency' : null,
				'values' : null,
				'functionName' : 'dayOfMonth'
			},
			{
				'name' : 'Week Of Month',
				'frequency' : null,
				'values' : null,
				'functionName' : 'weekOfMonth'
			},
			{
				'name' : 'Week Of Year',
				'frequency' : null,
				'values' : null,
				'functionName' : 'weekOfYear'
			},
			{
				'name' : 'Month',
				'frequency' : null,
				'values' : null,
				'functionName' : 'month'
			},
			{
				'name' : 'Year',
				'frequency' : null,
				'values' : null,
				'functionName' : 'year'
			},
		],


		getDescription : function(){
			return this.description;
		},
		getScheduleOptions : function(){
			return this.scheduleOptions;
		},
		getSelectedOption : function(){
			return this.selectedSchedule.value;
		},
		setSelectedOption : function(index){
			this.selectedSchedule  = this.scheduleOptions[index];
		},
		selectedOptionChanged : function(){
			this.setupComplexScheduleCreator();
		},
		setupComplexScheduleCreator : function(){
			if( this.getSelectedOption()  == 'complex'){
				this.showComplexScheduleCreator = true;
			}else{
				this.showComplexScheduleCreator = false;
			}
		},
		getScheduleStringForComplexSchedule : function(){
			var laterSchedule = later.parse.recur();
			angular.forEach(this.complexScheduleParams,function(param){
				if( param.values ){
					var valArray = param.values.split(",");
					var fre = param.frequency;
					angular.forEach(valArray,function(value, key){
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
			})
			var nextNDays = function(schedule,n){
				for(var i=0;i<n;i++){
					var day = moment().add(i,'day');
					// schedule = schedule.and();
					schedule.on(day.date()).dayOfMonth().on(day.month()+1).month().on(day.year()).year()
					if( i+1 < n )
						schedule.and();
				}
				return schedule;
			}	

			if( this.nextNDays ){
				laterSchedule = nextNDays(laterSchedule,parseInt(this.nextNDays));
			}

			console.log(laterSchedule.schedules);
			return JSON.stringify(laterSchedule.schedules);
		},
		submit : function(){
			var description = this.getDescription();
			var schedule = this.getSelectedOption();
			if( schedule == 'complex' ) schedule = this.getScheduleStringForComplexSchedule();

			var newSavedTask = Task.save({
				'description' : description,
				'schedule' : schedule
			},function(data){
				// console.log(newSavedTask);
				$scope.$broadcast('tasksUpdated');
				$scope.newTaskForm.init();
			},function(data){
				$rootScope.$emit('error',data.data.description);
				//console.log(data);
			})
				/* Submit Form Ends */
		},	
		'init' : function(){
			this.setSelectedOption(0);
			this.showComplexScheduleCreator = false;
			angular.forEach(this.complexScheduleParams,function(param){
				param.values = "",
				param.frequency = "on"
			})
			this.description = "";
		}

	}
	function week_of_month(date) {
		prefixes = [1,2,3,4,5];
		return prefixes[0 | moment(date).date() / 7];
	}
	
	$scope.fillToday = function(){
		var today  = moment(moment());
		$scope.newTaskForm.complexScheduleParams[0].values = ((today.isoWeekday())+1)%7 + "";
		$scope.newTaskForm.complexScheduleParams[1].values = today.date() + "";
		$scope.newTaskForm.complexScheduleParams[2].values = week_of_month(moment(moment())) + "";
		$scope.newTaskForm.complexScheduleParams[3].values = today.isoWeek() + "";
		$scope.newTaskForm.complexScheduleParams[4].values = today.month() + 1 + "";
		$scope.newTaskForm.complexScheduleParams[5]	.values = today.year() + "";
	}
	$scope.newTaskForm.init();
	var MyTasks = new TaskList($scope,Task,'MyOwnTaskList',$rootScope);
	MyTasks.updateView();

}])
