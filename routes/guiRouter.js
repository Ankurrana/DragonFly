var express = require('express');
var router = express.Router();
var guiController = require('../controllers/guiController.js');
var auth = require('../middlewares/auth.js');
var passport  = require('passport');

router.get('/',guiController.Get_index);
router.get('/mytasks',passport.authenticate('jwt',{session:false}),guiController.Get_myTasks);
module.exports = router;