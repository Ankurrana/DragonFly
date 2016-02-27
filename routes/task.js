/* Defines all the routes */
var express = require('express');
var router = express.Router();
var passport = require('passport');
var taskController = require('../controllers/taskController.js');
var auth = require('../middlewares/auth.js');

// console.log(taskController.Get_new);
router.get('/new',taskController.Get_new);
router.post('/new',taskController.Post_new);

module.exports = router;