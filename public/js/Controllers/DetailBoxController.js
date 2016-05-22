
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
			},function(err){
				$rootScope.$emit('error',err);
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
		Comment.save({
			'key' : $scope.taskDetails.key,
			'comment' : $scope.newComment
		},function(data){
			updateView();
		},function(err){
			$rootScope.$emit('error',err);
		});
	}
}])
