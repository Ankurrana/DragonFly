'use strict'
var app = angular.module('dragon', ['ngSanitize','ngRoute','ngCookies','ngResource']);

app.controller('templateController',['$scope','$http','$cookies','$resource',function($scope,$http,$cookies,$resource){
	$scope.labels = {
		'title' : 'TaskKeeper',
		'bottomline' : 'Remembers your little things for you! :)',
		'error' : [],
		'info' : [],
		'welcomeMessage' : 'What do you want me to remember?'
	};
	$scope.user = {
		username : 'Guest'
	}

}])



app.controller('mainController',['$scope','$http','$cookies','$resource','$route','$window',function($scope,$http,$cookies,$resource,$route,$window){
	var isUserLoggedIn = false;
	var user = {};
	var loginFormURL = 'public/views/login.jade'
	var bodyURL = 'public/views/body.html'
	$scope.currentViewURL = loginFormURL;
	$scope.newTaskFormURL = 'public/views/newTask.html';
	$scope.error;
	$scope.loginFormData = {username:undefined,password:undefined}; //username and password 

	$scope.loginFormSubmit = function(){
		loginRequest($scope.loginFormData.username,$scope.loginFormData.password);
	}

	var loginRequest = function(username, password){
		var data = {
			'username' : username,
			'password' : password
		};
		$http.post('/api/token',data).then(function(data){
			if(data.data.token){
				$cookies.put('token',data.data.token)
				$scope.$emit('loggedIn');
			}else{
				showError(data.data.message);
			}	
		});
	}

	$scope.$on('loggedIn',function(){
		$scope.currentViewURL = bodyURL;
		resetError();
		getUser();
	})

	var getUser = function(){
		var data = {};
		$http.get('/api/me', { headers : { 'jwt' : $cookies.get('token') } }).then(function(d){
			$scope.user.username = d.data.username;
			$scope.user.name = d.data.name;
			$scope.user.email = d.data.email;
			$cookies.putObject('user',$scope.user);  
		},function(d){
			console.log("Some Error Occured while fetching User Data :  "  + d );
		})
	}

	var showError = function(msg){ $scope.error = msg;}
	var resetError = function(msg){ $scope.error = undefined; }

	if( $cookies.get('token') ){
		$scope.$emit('loggedIn');
	}

	$scope.logout = function(){
		$scope.$emit('loggedOut');
		var cookies = $cookies.getAll();
		angular.forEach(cookies, function (v, k) {
    		$cookies.remove(k);
		});
		$window.location.reload();
	}

}])


app.service('Task',['$resource','$cookies',function($resource,$cookies){
	return $resource('/api/tasks/:key',{'date':'@date','key':'@key'},{
			'get' : { 'method' : 'GET' , 
				headers : {
					'jwt' : $cookies.get('token')
				},
				isArray:true
			},
			'getOne' : {
				'method' : 'GET',
				'headers' : {
					'jwt' : $cookies.get('token')
				}  
			},
			'save' : {
				'method' : 'POST',
				'headers' : {
					'jwt' : $cookies.get('token')
				}
			},
			'update' : {
				'method' : 'PUT',
				'headers' : {
					'jwt' : $cookies.get('token')
				}
			}
		}
	);
}])


app.service('Comment',['$resource','$cookies',function($resource,$cookies){
	return $resource('/api/comments/:key',{'key':'@key'},{
			'get' : { 'method' : 'GET' , 
				headers : {
					'jwt' : $cookies.get('token')
				},
				isArray:true
			},
			'save' : {
				'method' : 'POST',
				'headers' : {
					'jwt' : $cookies.get('token')
				}
			}
		}
	);
}])


var TaskList = function(scope,Task,ln,$rootScope){
	var that = this;
	this.tasks = [];
	this.localScope = scope;
	this.ListName = ln;
	this.localScope.ListName = ln;
	this.localScope.tasks = [];
	this.localScope.date = {
		'val' : new Date(),
		'next' : function(){
			this.val = new Date( moment(this.val).add(1,'days'));
		},
		'previous' : function(){
			this.val = new Date( moment(this.val).subtract(1,'days'));
		},
		'today' : function(){
			this.val = new Date();
		}
	};
	this.localScope.$watch('date.val',function(){
		that.updateView();
	})
	this.localScope.$on('tasksUpdated',function(){
		that.updateView();
	})

	this.getTasks = function(date){
		Task.get({
			'date' : moment(that.localScope.date.val).format('YYYY-MM-DD')
		},function(data){
			var UpdatedTasks = [];			
			var index = 1;
			angular.forEach(data, function(item) {
				item.serial = index++;
				UpdatedTasks.push(item);
			});
			that.tasks = UpdatedTasks;
			that.renderTasks();
		},function(data){
			console.log("Error: " + data);
		})
	},
	this.localScope.taskCompleted = function(taskKey){
			var keyValue = taskKey.split('-')[1];
			Task.update({
				'key' : keyValue,
				'status' : 'COMPLETED',
				'completedAt' : moment( moment() ).format('YYYY-MM-DD')
			},function(data){	
				that.localScope.$broadcast('tasksUpdated');
				console.log(data);
			},function(data){
				console.log(data);
			})
	},
	this.localScope.taskInProgress = function(taskKey){
		var keyValue = taskKey.split('-')[1];
		Task.update({
			'key' : keyValue,
			'status' : 'INPROGRESS'
		},function(data){
			console.log(data);
			that.localScope.$broadcast('tasksUpdated');
		},function(data){
			console.log(data);
		})		
	}
	this.renderTasks = function(){
		var tasksList = [];
		angular.forEach(this.tasks,function(value){
			if(value.status == "COMPLETED"){
				value.cssClass = "strike";
			}
			tasksList.push(value);
		})
		that.localScope.tasks = tasksList;

	}
	this.updateView = function(){
		that.getTasks(moment(that.localScope.date.val).format('YYYY-MM-DD') );
	}
	this.localScope.updatetasksView = function(){
		that.updateView();
	}
	this.localScope.showDetails = function(taskKey){

		var taskKey = taskKey.split('-')[1];
		$rootScope.$broadcast('showDetails',taskKey);
	}
}

app.controller('detailBoxController',['$scope','$http','$cookies','$resource','Comment','$rootScope','Task',function($scope,$http,$resource,$cookies,Comment,$rootScope,Task){
	var taskDetails = {};
	$scope.taskDetails = {};
	$scope.newComment;
	$scope.showDetailBox = false;
	$rootScope.$on('showDetails',function(event,taskKey){
		$scope.showDetailBox = true;
			
		getDetails(taskKey,function(taskDetails){
			$scope.taskDetails = taskDetails;
		});
	})

	var getDetails = function(taskKey,callback){

		Task.getOne({
			'key' : taskKey
		},function(data){
			//console.log(data);
			taskDetails.description = data.description;
			taskDetails.author = data.author;
			taskDetails.status = data.status;
			taskDetails.comments = [];
			taskDetails.key = data.key.split('-')[1]
			Comment.get({
				'key' : taskKey
			},function(comments){
				taskDetails.comments = [];
				angular.forEach(comments, function(item) {
					taskDetails.comments.push(item);
				})
				callback(taskDetails);
			})
		})
	}

	var updateView = function(){
		$scope.newComment = "";
		getDetails($scope.taskDetails.key,function(data){
			$scope.taskDetails = data;
		})
	}

	$scope.addComment = function(){
		if( !$scope.newComment  || !$scope.taskDetails)
			return;
		// console.log($scope.taskDetails);
		Comment.save({
			'key' : $scope.taskDetails.key,
			'comment' : $scope.newComment
		},function(data){
			updateView();
		});
	}

	
	// console.log($scope.taskDetails);
}])




// app.controller('commentsController',['$scope','$http','$cookies','$resource','Comment',function($scope,$http,$resource,$cookies,Comment){
// 	$scope.controllerName = "commentsController";
// 	$scope.updateCommentBox = function(){
// 		var commentsList = Comment.get({
// 			key : '59'
// 		},function(data){
// 			$scope.comments = data;
// 		})	
// 	}
// }])



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
			console.log("Selected Schedule Option Changed");
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

			console.log("New Submission with " + description + ' schedule : ' + JSON.stringify(schedule) );

			if( schedule == 'complex' ) schedule = this.getScheduleStringForComplexSchedule();

			console.log('Requesting Server to create a new Task (' +  description+', ' + schedule + ')' );

			var newSavedTask = Task.save({
				'description' : description,
				'schedule' : schedule
			},function(data){
				console.log(newSavedTask);
				$scope.$broadcast('tasksUpdated');
				$scope.newTaskForm.init();
			},function(data){
				console.log(data);
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


app.filter('titleCase', function() {
    return function(input) {
      input = input || '';
      return input.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};
})


app.directive('task',function(){
	return {
		'templateUrl' : 'public/views/task.html',
	}
})

app.directive('comments',function(){
	return {
		'templateUrl' : 'public/views/comments.html'
	}
})


app.directive('schedulecreator',function(){
	return {
		'templateUrl' : 'public/views/scheduleCreatorTemplate.html'
	}
})

