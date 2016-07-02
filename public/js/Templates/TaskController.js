var TaskList = function(scope,Task,ln,$rootScope){
	var that = this;
	this.tasks = [];
	this.localScope = scope;
	this.ListName = ln;
	this.localScope.ListName = ln;
	this.localScope.tasks = [];
	scope.filters = {
		'showActive' : true,
		'showCompleted' : true
	};

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

	scope.$watch('filters.showCompleted',function(){
		that.renderTasks();
		// console.log('Tasks Updated! Show completed');
	})
	scope.$watch('filters.showActive',function(){
		that.renderTasks();
		// console.log('Tasks Updated! Show Active');
		
	})
	this.localScope.$watch('date.val',function(){
		that.updateView();
	})


	this.localScope.$on('tasksUpdated',function(){
		that.updateView();
	})
	
	$rootScope.$on('tasksUpdated',function(){
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
			// console.log(that.tasks);
			that.renderTasks();
		},function(err){
			$rootScope.$emit('error',err)
		})
	},
	this.localScope.taskCompleted = function(taskKey){
			var keyValue = taskKey;
			Task.update({
				'key' : keyValue,
				'status' : 'COMPLETED',
				'completedAt' : moment( moment() ).format('YYYY-MM-DD')
			},function(data){	
				that.localScope.$broadcast('tasksUpdated');
			},function(err){
				$rootScope.$emit('error',err);
			})
	},
	this.localScope.taskInProgress = function(taskKey){
		var keyValue = taskKey;
		Task.update({
			'key' : keyValue,
			'status' : 'ACTIVE'
		},function(data){
			that.localScope.$broadcast('tasksUpdated');
		},function(err){
			$rootScope.$emit('error',err)			
		})		
	},
	this.renderTasks = function(){
		var tasksList = [];
		angular.forEach(this.tasks,function(value){
			if(value.status == "COMPLETED"){
				value.cssClass = "strike";
			}
			if(value.status == 'COMPLETED' && scope.filters.showCompleted){
			 	tasksList.push(value);
			 }
			if(value.status == 'ACTIVE' && scope.filters.showActive){
				tasksList.push(value)
			}
		})
		that.localScope.tasks = tasksList;
		// console.log(that.localScope.tasks);

	}
	this.updateView = function(){
		that.getTasks(moment(that.localScope.date.val).format('YYYY-MM-DD') );
	}
	this.localScope.updatetasksView = function(){
		that.updateView();
	}
	this.localScope.showDetails = function(taskKey){
		var taskKey = taskKey;
		$rootScope.$broadcast('showDetails',taskKey);
	}
	this.localScope.edit = function(taskKey){
		var taskKey = taskKey;
	}
}