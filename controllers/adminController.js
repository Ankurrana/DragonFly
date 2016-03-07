var User = require('../models/User.js');
var path = require('path');

var adminController = {
	Get_index : function(req,res){
		res.render('index');
		//res.sendFile('admin.html',{root: path.join(__dirname,'../public') })
	},
	Get_users :  function(req,res){
			User.getAllUsers(function(err,data){
			if(err)
				res.send('Error Retrieving data from the server/database');
			else
				res.json(data);
		})
	},
	Get_user : function(req,res){
		User.getUserByUsername(req.params.username,function(err,data){
			if(err)
				res.send(405)
			else 
				res.json(data)		
		});
	}
}
module.exports = adminController;