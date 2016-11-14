var TaskList = function(scope,Task,ln,$rootScope){
	var that = this;
	this.tasks = [];
	this.localScope = scope;
	this.ListName = ln;
	this.localScope.ListName = ln;
	this.localScope.tasks = [];
	scope.showWaiter = true;
	scope.filters = {
		'showActive' : true,
		'showCompleted' : true
	};

	this.localScope.date = {
		'val' : new Date(),
		'displayDate' : function(){
			return moment(this.val).format("ddd, MMM Do YYYY");
		},
		'csvFormatDate' : function(){
			return moment(this.val).format("MMM Do YYYY");
		},
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
		scope.showWaiter = true;
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
			scope.showWaiter = false;
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

	this.localScope.exportData = function(){
		// This function exports a table with Sno., Description and Remarks in csv format
			var data = this.tasks;
			var date = that.localScope.date.csvFormatDate();
			var csvContent = "data:text/csv;charset=utf-8;";
			csvContent += "Date ," + date + "\n";
			if(data.length > 0){
			csvContent += "Sno.,Task Description,Status,Owner,Remarks\n"
				data.forEach(function(infoArray, index){
					dataString = index + 1 + "," + infoArray.description + "," + infoArray.status + "," + infoArray.owner.name + ", ";   
					csvContent += index < data.length ? dataString+ "\n" : dataString;
				});
			}else{
				csvContent += "No Tasks Scheduled"
			}
			var encodedUri = encodeURI(csvContent);
			var link = document.createElement("a");
			link.setAttribute("href", encodedUri);
			link.setAttribute("download", "my_data.csv");
			document.body.appendChild(link); // Required for FF

			link.click();
	}
}

