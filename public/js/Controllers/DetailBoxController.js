app.controller('detailBoxController',['$scope','$http','$cookies','$resource','Comment','$rootScope','Task','User','Share','Checkpoint',function($scope,$http,$resource,$cookies,Comment,$rootScope,Task,User,Share,Checkpoint){
	var taskDetails = {};
	$scope.taskDetails = {};
	$scope.newComment;
	$scope.showDetailBox = false;
	$scope.checkpointBox = "";
	$scope.showWaiter = false;
	$rootScope.$on('showDetails',function(event,taskKey){
		$scope.showWaiter = true;
		getDetails(taskKey,function(taskDetails){
			$scope.showWaiter = false;
			$scope.showDetailBox = true;
			$scope.taskDetails = taskDetails;

		});
	})

	$scope.users;
	$scope.share;
	
	$scope.shareit = function(){
		if($scope.sharee){
			if(!confirm('Are you sure you want to share it with :' +  $scope.sharee.username)){
				return
			}
			Share.share({
				'key' : taskDetails.key,
				'username' : $scope.sharee.username  
			},function(data){
				$scope.sharee.username = "";
			},function(err){
				console.log('Error : '+ err);
			})

		}
	}

	var getDetails = function(taskKey,callback){
		
		Task.getOne({
			'key' : taskKey
		},function(data){

			taskDetails.description = data.description;
			taskDetails.author = data.author;
			taskDetails.status = data.status;
			taskDetails.comments = [];
			taskDetails.key = data.key;
			taskDetails.owner = data.owner
			taskDetails.checkpoints = data.checkpoints

			angular.forEach(taskDetails.checkpoints,function(item){
				item.changeCheckpointStatus = function(status){
					Checkpoint.changeStatus({
						'id' : item._id, 
						'key' : taskDetails.key,
						'status' : item.status
					},function(data){
						updateView()	
					})	
				}
			})

			if(taskDetails.owner == undefined){
				taskDetails.owner = {};
				taskDetails.owner.username = data.author;
				taskDetails.owner.name = data.author;
			}
			Comment.get({
				'key' : taskKey
			},function(comments){
				$scope.showDetailBox = true;
				taskDetails.comments = [];
				angular.forEach(comments, function(item){
					item.createdAt = moment(item.createdAt).fromNow();
					taskDetails.comments.push(item);
				})
				callback(taskDetails); 	
				
			},function(err){
				$rootScope.$emit('error',err);
			})
		})
		if(!$scope.users)
			User.get({},function(data){
				$scope.users = data;
			})
	}

	$rootScope.$on('loggedIn',function(){
		User.get({},function(data){
			$scope.users = data;
		})
	})

	var updateView = function(){
		$scope.newComment = "";
		$scope.checkpointBox = ""		
		getDetails($scope.taskDetails.key,function(data){
			$scope.taskDetails = data;
			$scope.showWaiter = false;
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
	},
	$scope.delete = function(){
		if(!confirm('Are you sure you want to delete the Task with Description : ' + taskDetails.description))
			return;
		
		Task.delete({
			key : $scope.taskDetails.key
		},function(data){
			$rootScope.$emit('tasksUpdated')
			$scope.showDetailBox = false;
		})
	}

	$scope.addCheckpoint = function(){
		if($scope.checkpointBox != "") {
			Checkpoint.save({
				'checkpoint' : $scope.checkpointBox,
				'key' : $scope.taskDetails.key
			},function(data){
				updateView();		
			})
		}
	}

}])
