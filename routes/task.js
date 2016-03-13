/* Defines all the routes */
var express = require('express');
var router = express.Router();
var passport = require('passport');
var taskController = require('../controllers/taskController.js');
var auth = require('../middlewares/auth.js');

router.get('/new',passport.authenticate('jwt',{session:false}),taskController.Get_new);
router.post('/new',taskController.Post_new);
router.get('/all',taskController.Get_tasks);

router.param('key',function(req,res,next,key){
	req.key = 'ankur' + '-' + key;
	next();
});
router.get('/:key',taskController.Get_getTaskByKey);
router.get('/update/:key',taskController.Get_UpdateTask);
router.post('/update/:key',taskController.Post_UpdateTask);

module.exports = router;