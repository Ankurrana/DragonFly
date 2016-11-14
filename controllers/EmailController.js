var Task  = require('../models/Task.js')
var path = require('path');
var moment = require('moment');
var User = require('../models/User.js');
var Checkpoint = require('../models/Checkpoint.js');
var UserController = require('./userController.js');
var ErrorManager = require('./ErrorController.js');
var validator = require('./validatorController.js');
var scheduleController = require('./scheduleController.js');
var momentRange = require('moment-range')
var Comment = require('./commentController.js');
var RandomStringGenerator = require('randomstring');
var EmailSender = require('../services/EmailSender.js');

var EmailController = {
     

}


module.exports = EmailController;





