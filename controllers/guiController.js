var taskController = require('./taskController.js');
var moment = require('moment');
var guiController = {
	'Get_index' : function(req,res){
		res.render('index');
	},
	'Get_myTasks' : function(req,res){
		console.log(moment(moment(),'YYYY-MM-DD'));
		var date = req.query.date ? req.query.date : moment(moment()).format('YYYY-MM-DD');
		taskController.getTasksfordate(req.user.username,date,function(tasks){
			res.render('mytasks',{ data:tasks , date : date });
		});
	}
}


module.exports = guiController;