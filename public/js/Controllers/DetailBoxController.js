app.controller('detailBoxController',['$scope','$http','$cookies','$resource','Comment','$rootScope','Task','User','Share','Checkpoint','FileUploader',function($scope,$http,$resource,$cookies,Comment,$rootScope,Task,User,Share,Checkpoint,FileUploader){
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
			taskDetails.owner = data.owner;
			taskDetails.checkpoints = data.checkpoints;
			taskDetails.startDate = data.startDate;
			taskDetails.completedAt = data.completedAt;

			taskDetails.files = [];

			angular.forEach(data.files, function(file){
				taskDetails.files.push(new MyFile(file.filename,file._id, taskDetails.key,FileUploader));
			})


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

	$scope.uploadFile = function(){
		
		if($scope.myfile) {

			var my_file =  new MyFile($scope.myfile.name,undefined,$scope.taskDetails.key,FileUploader)
			my_file.clientFile = $scope.myfile;

			my_file.save(function(err,data){
				if(err){
					console.log('Oops! Error at lie 157 of detail Controller')
				}else{
					updateView();
				}
			})
			
		}
	}

}])



function MyFile(filename,id,taskKey,FileService){
	this.name = filename;
	this._id = id;
	this.taskKey = taskKey;
	this.thata = this;
	this.clientFile;
	this.validFileExtentions = [
		"txt","log"
	]
	this.fetch = function(cb){
		FileService.get({
			'id' : this._id,
			'key' : this.taskKey
		},function(data){
			cb(data);
		})
	}

	this.save = function(cb){
		if(!this.clientFile){
			console.log('No File Attached to the File Object');
		}
		if( this.validate()){
			var fd = new FormData();			
			fd.append('file',this.clientFile)
			
			var taskKey =  this.taskKey;
			FileService.save({'key' : taskKey},fd,function(data){
				cb(null,data);
			},function(err){
				cb(err);
				console.log('I think there\'s an error while saving the file');
			})
		}else{
			cb({
				'error' : this.extention + 'is not a valid extention'  
			})
			console.log('Not a valid extention!');
		}
	}
	this.getFileName = function(){
		return this.name;
	}
	this.validate = function(){
		var extention = this.name.split('.').pop()
		if(  this.validFileExtentions.indexOf(extention) > -1 ){
			return true;
		}else{
			return false;
		}
	}

	this.download = function(){
		var file_name = this.getFileName();
		this.fetch((function(){
			

			var filename = file_name;
			
			return function(data){
				var saveByteArray = (function () {
					var a = document.createElement("a");
					document.body.appendChild(a);
					a.style = "display: none";
					return function (data, name) {
						var blob = new Blob(data, {type: "text/plain"}),
							url = window.URL.createObjectURL(blob);
						a.href = url;
						a.download = name;
						a.click();
						window.URL.revokeObjectURL(url);
					};
				}());

				function convertAsciiToText(intArray){
					var finalString = "";
					intArray.forEach(function(element) {
						finalString += String.fromCharCode(element)
					}, this);

					return finalString;
				}
				saveByteArray([convertAsciiToText(data.binaryData.data)],filename);
			}
		})());
	}

	
}
