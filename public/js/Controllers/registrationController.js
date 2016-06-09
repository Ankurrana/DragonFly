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
    $scope.successMessageBox = {
        'showMessageBox' : false,
        'message' : '',
        close : function(){
            this.showMessageBox = false;
            this.message = '';
        },
        set : function(msg){
            this.message = msg;
            this.showMessageBox = true;
        }   
    }
    $scope.success = function(msg){
        console.log($scope.successMessageBox);
        $scope.successMessageBox.set('Hello ' + $scope.formData.username + ', You are registered!, Please Login to continue');
        $scope.reset();
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
    		// console.log(data);
    		$scope.registrationError.close();
            $scope.success($scope.formData.username + 'Sucessfully Registered! Please login');
    	},function(data){
    		$scope.registrationError.showError(data.data.message);
    	})
    }
}])