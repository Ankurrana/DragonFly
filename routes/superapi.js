var express = require('express');
var router = express.Router();
var auth = require('../middlewares/auth.js');
var registrationController = require('../controllers/registrationController.js');
var passport = require('passport');
var authController = require('../controllers/authAPIController.js');
var userAPIController = require('../controllers/userAPIController.js');
var superuserAPIController = require('../controllers/superuserAPIController.js');
var taskAPIController = require('../controllers/taskAPIController.js');
var globals = require('./../config/GLOBALS.js');

router.use(passport.authenticate('jwt'));
router.use(function(req,res,next){
    // This middleware authenticates the superuser
    if( req.user._id == globals["SuperuserID"] )
        next();
    else{
        res.send('You are not authenticated to view this page!');
    }
})
router.get('/users',userAPIController.getUsers);
router.get('/group/',superuserAPIController.getUserGroups);
router.get('/group/:groupId',superuserAPIController.getUserGroup);
router.post('/group/',superuserAPIController.createUserGroup);
//router.post('/group/:groupId',superuserAPIController.getUserGroup);
router.put('/group/:groupId',superuserAPIController.updateGroup);

module.exports = router;