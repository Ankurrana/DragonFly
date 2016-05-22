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
