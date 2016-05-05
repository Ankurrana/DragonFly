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



app.controller('taskController',['$scope','$http','$cookies','$resource',function($scope,$http,$cookies,$resource){
	$scope.viewTasksURL = "public/views/tasksList.html";
	$scope.tasks = [];
	$scope.newTaskForm = {};


	var Task = $resource('/api/tasks/:key',{'date':'@date','key':'@key'},{
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

	$scope.getTasks = function(date){
		console.log('Getting Tasks For :' + date );
		Task.get({
			'date' : date
		},function(data){
			var UpdatedTasks = [];			
			var index = 1;
			angular.forEach(data, function(item) {
				item.serial = index++;
				if( item.status == "ACTIVE" ){
					item.cssClass = ''
				}else if( item.status == "COMPLETED"){
					item.cssClass = 'strike'
				}else if(item.status == "INPROGRESS"){
					item.cssClass = ''
				}
  				UpdatedTasks.push(item);
			});
			$scope.tasks = UpdatedTasks;
		},function(data){
			console.log("Error: " + data);
		})
	}
	
	$scope.newTaskFormSubmit = function(){
		var newSavedTask = Task.save({
			'description' : $scope.newTaskForm.description,
			'schedule' : $scope.newTaskForm.schedule
		},function(data){
			console.log(newSavedTask);
			$scope.$broadcast('tasksUpdated');
			$scope.newTaskForm.description = "";
		},function(data){
			console.log(newSavedTask);
		})
	}


	$scope.taskCompleted = function(taskKey){
		var keyValue = taskKey.split('-')[1];
		Task.update({
			'key' : keyValue,
			'status' : 'COMPLETED'
		},function(data){	
			$scope.$broadcast('tasksUpdated');
			console.log(data);
		},function(data){

			console.log(data);
		})
	}

	$scope.taskInProgress = function(taskKey){
		var keyValue = taskKey.split('-')[1];
		Task.update({
			'key' : keyValue,
			'status' : 'INPROGRESS'
		},function(data){
			console.log(data);
			$scope.$broadcast('tasksUpdated');
		},function(data){
			console.log(data);
		})		
	}

	$scope.$on('tasksUpdated',function(){
		$scope.updateTasks();
	})
	$scope.date1 = {
		'val' : new Date(),
		'previous' : function(){
			var new_date = new Date(moment(this.val).subtract(1, 'days').format('YYYY-MM-DD'));
			$scope.date1.val = new_date;
			$scope.updateTasks();
		},
		next : function(){
			var new_date = new Date(moment(this.val).add(1, 'days').format('YYYY-MM-DD'));
			$scope.date1.val = new_date;
			$scope.updateTasks();

		}
	};
	$scope.updateTasks = function(){
		console.log('Date : = ' + $scope.date1.val);
		var d = moment($scope.date1.val).format('YYYY-MM-DD');
		$scope.getTasks(d);
	}
	$scope.getTasks(moment($scope.date1.val).format("YYYY-MM-DD"));


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

// Create a RestFUL resource which uses cookies to get the token and request from the server!
/*
	1. Check if the user is login
		if not , then show him the login buttons
		else move to the 


*/





/*$scope.username = "Ankur rana";
	$scope.formData = {};

	if( $cookies.get('token') ){
		console.log('asdasd');
		$scope.$emit('loggedIn');
	}

	$scope.submit = function(){
		loginRequest($scope.formData.username,$scope.formData.password);
	}

	var privateData = {};
	var userInfo;
	var loggedIn = false;
	if($cookies.getObject('user')){
		console.log($cookies.getObject('user'));
	}
	$scope.url = '/public/views/login.jade'

	$scope.info = {
		loggedInUser : '',
		message  : 'Please Login',
		status : 'LOGGED OUT',
		token : undefined,
		tasks : undefined,
		date : new Date()
	}
	var addAuthenticationDataToHeaders = function(){
		return { headers : {'jwt' : privateData.token}}
	}
	var loginRequest = function(username, password){
		var data = {
			'username' : username,
			'password' : password
		};
		$http.post('/api/token',data).then(function(data){
			if(data.data.token){
				ClientLogIn(data.data.token);
				$cookies.putObject('user',data.data);
				loggedIn = true;
				$scope.$emit('loggedIn');
			}else{
				showError(data.data.message);
			}	
		});
	}
	var ClientLogIn = function(token){
				privateData.token = token;
				$scope.info.status = 'LOGGEDIN'
				$cookies.put('token',privateData.token);
	}
	var showError = function(msg){
		$scope.info.message = msg;
	}
	var getUser = function(){
		var data = {};
		$http.get('/api/me', { headers : privateData.token }).then(function(d){
			$scope.username = d.data.username  
		},function(){})
	}
	$scope.change = function(date){
		if(moment($scope.info.date).isValid()) getTasks(moment($scope.info.date).format('YYYY-MM-DD'));
	}
	

	//loginRequest('ankurrana','ankurrana');

	// if( !privateData.token )
	// 	console.log("TOKEN UNDEFINED YET!");
	// console.log(privateData.token);
	var Task = $resource('/api/tasks/:key',{'date':'@date'},{
			'get' : { 'method' : 'GET' , 
				headers : {
					'jwt' : privateData.token
				},
				isArray:true
			},
			'getOne' : {
				'method' : 'GET',
				'headers' : {
					'jwt' : privateData.token
				}  
			}	
		}
		
	);


	var getTasks = function(date){
		$scope.data = Task.get({'date':date},function(){});
	}

	

	$scope.$on('init',function(){
		console.log("Initialized!");
	})

	$scope.$emit('init');
	$scope.$on('loggedIn',function(){
		getUser();
		getTasks(moment(moment()).format('YYYY-MM-DD'));
		$scope.url = '/public/views/tasksList.html'
	})

	if( $cookies.get('token') ){
		console.log('asdasd');
		$scope.$emit('loggedIn');
	}*/