var express = require('express');
var router = express.Router();
var auth = require('../middlewares/auth.js');
var registrationController = require('../controllers/registrationController.js');
var passport = require('passport');
var authController = require('../controllers/authAPIController.js');
var userAPIController = require('../controllers/userAPIController.js');
var taskAPIController = require('../controllers/taskAPIController.js');

router.get('/tasks',passport.authenticate('jwt'),taskAPIController.getTaskForPeriod);
router.post('/tasks',passport.authenticate('jwt'),taskAPIController.addTask);
router.get('/tasks/share/:key/:username',passport.authenticate('jwt'),taskAPIController.shareTaskWithUsername)
router.get('/tasks/:key',passport.authenticate('jwt'),taskAPIController.getTaskByKey)
router.put('/tasks/:key',passport.authenticate('jwt'),taskAPIController.updateTaskByKey);
router.delete('/tasks/:key',passport.authenticate('jwt'),taskAPIController.deleteTaskByKey);

router.get('/users',userAPIController.getUsers); //It should be an authenticated route!! Temporarily setting it to unauthenticated!
router.post('/users',registrationController.newUserRequestHandler);
router.get('/users/:username',passport.authenticate('jwt'),userAPIController.getUser);
router.post('/token',authController.requestAuthorisationToken);

router.get('/comments/:key',passport.authenticate('jwt'),taskAPIController.getCommentsOfTaskByKey)
router.post('/comments/:key',passport.authenticate('jwt'),taskAPIController.addCommentToTaskByKey)




router.get('/me',passport.authenticate('jwt'),function(req,res){
	res.send(req.user);
})
module.exports = router;