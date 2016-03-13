var express = require('express');
var router = express.Router();
var auth = require('../middlewares/auth.js');
var adminController = require('../controllers/adminController.js');
var registrationController = require('../controllers/registrationController.js');
var authController = require('../controllers/authController.js');

// router.use(auth);

// router.get('/',adminController.Get_index);
// router.get('/users',adminController.Get_users);
// router.get('/user/:username',adminController.Get_user);


router.post('/users',registrationController.newUserRequestHandler);
router.post('/token',authController.requestAuthorisationToken);

module.exports = router;