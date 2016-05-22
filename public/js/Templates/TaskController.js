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
		},function(err){
			$rootScope.emit('error',err)
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
			},function(err){
				$rootScope.$emit('error',err);
			})
	},
	this.localScope.taskInProgress = function(taskKey){
		var keyValue = taskKey.split('-')[1];
		Task.update({
			'key' : keyValue,
			'status' : 'INPROGRESS'
		},function(data){
			that.localScope.$broadcast('tasksUpdated');
		},function(err){
			$rootScope.$emit('error',err)			
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