
app.controller('mainController',['$scope','$http','$cookies','$resource','$route','$window','$rootScope',function($scope,$http,$cookies,$resource,$route,$window,$rootScope){
	var isUserLoggedIn = false;
	var user = {};
	var loginFormURL = 'public/views/login.jade'
	var bodyURL = 'public/views/body.html'
	$scope.registrationFormURL = 'public/views/registrationForm.html';
	
	$scope.currentViewURL = loginFormURL;
	$scope.newTaskFormURL = 'public/views/newTask.html';
	$scope.taskDetailBox = 'public/views/detailBox.html'
	$scope.errorMessage = "";
	$scope.showErrorBox = false;
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
				console.log(data);
				$rootScope.$emit('error',data.data.message);
			}	
		});
	}

	$scope.closeErrorAlertBox = function(){
		resetError();
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
		},function(err){
			$rootScope.$emit('error',err);
		})
	}

	var showError = function(msg){ 
		$scope.errorMessage = msg;
		$scope.showErrorBox = true;
	}
	var resetError = function(msg){ 
		$scope.error = undefined; 
		$scope.showErrorBox = false;
	}



	$rootScope.$on('error',function(event,err){
		showError(err);
	})

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