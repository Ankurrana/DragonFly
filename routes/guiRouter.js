var express = require('express');
var router = express.Router();
var guiController = require('../controllers/guiController.js');
var auth = require('../middlewares/auth.js');

router.get('/',guiController.Get_index);
router.get('/mytasks',auth,guiController.Get_myTasks);
module.exports = router;