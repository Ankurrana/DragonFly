var UserGroups = require('../models/userGroups.js');
var logger = require('./logController.js');
var ErrorManager = require('./ErrorController.js');
var validator = require('./validatorController.js');
var encryptor = require('../services/bcrypt.js');


var SuperuserController = {
    'createUserGroup' : function(Groupname,callback){
        UserGroups.CreateNewUserGroup(Groupname,function(err,data){
            callback(err,data);
        })
    },
    
    'getUserGroups' : function(callback) {
        UserGroups.getUserGroups(function(err,data){
            if(!err)
                callback(null,data);
            else
                callback(err);
        })
    },
    'getUserGroup' : function(name,callback) {
        UserGroups.getMembers(name,function(err,data){
            if(!err)
                callback(null,data);
            else
                callback(err);
        })
    },
    'addUserToGroup' : function(groupId, userId,callback){
        console.log(groupId + " " + userId );
        UserGroups.addMember(groupId,userId,function(err,data){
            if(!err){   
                callback(null,data);
            }else{
                callback(err)
            }
        })
    },
    'deleteUserFromGroup' : function(groupId, userId, callback){
         UserGroups.deleteMember(groupId,userId,function(err,data){
            if(!err){   
                callback(null,data);
            }else{
                callback(err)
            }
        })
    }
}

module.exports = SuperuserController;
//Tests /



// SuperuserController.getUserGroups(function(err,data){
//     console.log(data);
// })


// SuperuserController.getUserGroup('yoyo',function(err,data){
//     console.log(data);
// })


// SuperuserController.addUserToGroup("57fc7d32c31ee1d404ff62d2",'57488fd34305763c4155ab24',function(err,data){
//     console.log(data);
// })

// SuperuserController.deleteUserFromGroup('yoyo','572b872461e183b832450978',function(err,data){
//     console.log(data);
// })

// SuperuserController.getUserGroup('yoyo',function(err,data){
//     console.log(data);
// })