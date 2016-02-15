var express = require('express');
var router = express.Router();
var auth = require('../middlewares/auth.js');
var adminController = require('../controllers/adminController.js');
// router.use(auth);

router.get('/',adminController.Get_index);
router.get('/users',adminController.Get_users);
router.get('/user/:username',adminController.Get_user);


module.exports = router;