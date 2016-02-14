var User = require('../models/User.js');
var express = require('express');
var router = express.Router();
var auth = require('../middlewares/auth.js');

// router.use(auth);

router.get('/users',function(req,res){
	User.getAllUsers(function(err,data){
		if(err)
			res.send('Error Retrieving data from the server/database');
		else
			res.json(data);
	})
});

router.get('/user/:username',function(req,res){
	User.getUserByUsername(req.params.username,function(err,data){
		if(err)
			res.send(405)
		else 
			res.json(data)		
	});
})


module.exports = router;