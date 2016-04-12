var express = require('express');
var router = express.Router();
var auth = require('../middlewares/auth.js');
var adminController = require('../controllers/adminController.js');
var registrationController = require('../controllers/registrationController.js');
var authController = require('../controllers/authAPIController.js');
var passport = require('passport');
var userAPIController = require('../controllers/userAPIController.js');
var taskAPIController = require('../controllers/taskAPIController.js');

router.get('/tasks',passport.authenticate('jwt'),taskAPIController.getTaskForPeriod);
router.post('/tasks',passport.authenticate('jwt'),taskAPIController.addTask);
router.get('/tasks/:key',passport.authenticate('jwt'),taskAPIController.getTaskByKey)
router.post('/users',registrationController.newUserRequestHandler);
router.get('/users/:username',userAPIController.getUser);
router.post('/token',authController.requestAuthorisationToken);

router.get('/authorisedLogin',passport.authenticate('jwt'),function(req,res){
	res.send(req.user);
})
module.exports = router;