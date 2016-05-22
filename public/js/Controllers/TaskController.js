app.controller('taskController',['$scope','$http','$cookies','$resource','$rootScope','Task',function($scope,$http,$cookies,$resource,$rootScope,Task){
	$scope.viewTasksURL = "public/views/tasksList.html";
	$scope.tasks = [];
	$scope.showComplesScheduleCreator = false;


	$scope.newTaskForm = {
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
							laterSchedule[fre](parseInt(value))[param.functionName]();
					})
				}
			})
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
				console.log(newSavedTask);
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
	$scope.newTaskForm.init();
	var MyTasks = new TaskList($scope,Task,'MyOwnTaskList',$rootScope);
	MyTasks.updateView();

}])
