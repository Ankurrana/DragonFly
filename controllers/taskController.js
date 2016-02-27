var Task  = require('../models/Task.js')
var path = require('path');
var moment = require('moment');

var taskController = {
	'Get_new' : function(req,res){
		res.sendFile('newTask.html', { root: path.join(__dirname, '../public') });
	},
	'Post_new' : function(req,res){
			var formData = req.body;
			var schedule;
			var d = [];
			var m = [];
			var y = [];
			var basicSchedule;
			if(formData.schedule == 'today'){
				d.push(moment().date());
				m.push(moment().month());
				y.push(moment().year());				
				basicSchedule = {
					'd' : d,
					'm' : m,
					'y' : y 
				}
				schedule = {
					schedule : [basicSchedule]
				}
			}else if(formData.schedule == 'tomorrow'){
				var tomorrow = moment().add(1,'day');
				d.push(tomorrow.date());
				m.push(tomorrow.month());
				y.push(tomorrow.year());				
				basicSchedule = {
					'd' : d,
					'm' : m,
					'y' : y 
				}
				schedule = {
					schedule : [basicSchedule]
				}
			}
			Task.addtask({
				'description' : formData.desc,
				'schedule' : schedule,
				'author' : (req.user != undefined)?req.user.username:'Ankur',
				'assignedTo' : (req.user != undefined)?req.user.username:'Ankur'
			},function(err,data){
				if(err)
					res.json(err)
				else
					res.json('Sucess '+ data);
			})
	},
	Get_tasks : function(req,res){
		// Get tasks for a particular user for a particular period
	}
}

module.exports = taskController;