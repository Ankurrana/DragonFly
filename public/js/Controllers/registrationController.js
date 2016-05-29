app.controller('registrationController',['$scope','$http','$cookies','$resource','$route','$window','$rootScope','User'
,function($scope,$http,$cookies,$resource,$route,$window,$rootScope,User){
    $scope.registrationError = {
        message : "",
        showErrorBox : false,
        showError : function(msg){
        	this.showErrorBox = true;
        	this.message = msg;
        },
        close : function(){
        	this.showErrorBox = false;
        	this.message = ""
        }
    }
    $scope.reset = function(){
		$scope.formData  = {
			'name' : '',
			'username' : '',
			'email' : '',
			'password' : ''
		}
    }
    $scope.submit= function(){
    	User.save({
    		'username' : $scope.formData.username,
    		'name' : $scope.formData.name,
    		'email' : $scope.formData.email,
    		'password' : $scope.formData.password
    	},function(data){
    		console.log(data);
    		$scope.registrationError.close();
    	},function(data){
    		$scope.registrationError.showError(data.data.message);
    	})
    }
}])