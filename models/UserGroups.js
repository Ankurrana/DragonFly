var mongoose = require('./mongooseConnection.js');
var UserModel = require('./User.js');
var usersGroupSchema = new mongoose.Schema({
	'name' : {
		type : String
	},
	'members' :[{type:mongoose.Schema.Types.ObjectId, ref :'User'}]
});

usersGroupSchema.statics.CreateNewUserGroup = function(groupName,callback){
    var userGroup = new this({
        'name' : groupName,
        'members' : []
    })
    userGroup.save(function(err,data){
        if(!err){
            callback(null,userGroup)
        }else{
            callback(err);
        }
    })
}


usersGroupSchema.statics.getUserGroups = function(callback){
    UsersGroup.find({})
        .populate('members','name')
        .exec(function(err,data){
            callback(err,data);
        });
}


usersGroupSchema.statics.addMember = function(groupIdentifier,userId,callback){
    var id;
    if(groupIdentifier.length >= 12){
        id = new require('mongoose').Types.ObjectId(groupIdentifier)
        console.log('Converted to Id!!');
    }
    UsersGroup.findOne({
        $or : [
        { _id : id },
        {name:groupIdentifier}]
    },"",function(err,userGroup){
        if(userGroup){
            userGroup.members.push(userId);
            userGroup.save(function(err,data){
                if(!err){
                    console.log(data);
                    callback(null,data)
                }else{
                    callback(err);
                }
            })
        }else{
            callback({
                'err' : 'No Group exists by that ID'
            });
        }
    })
}



usersGroupSchema.statics.getMembers = function(groupIdentifier,callback){
    var id;
    if(groupIdentifier.length < 12) 
        id = new require('mongoose').Types.ObjectId("123456789012")
    else{
        id = new require('mongoose').Types.ObjectId(groupIdentifier)
    }
    UsersGroup.findOne({
        $or : [
        { _id : id },
        {name:groupIdentifier}]
    })
    .populate('members','name')
    .exec(function(err,data){
        callback(err,data);
    })
}

usersGroupSchema.statics.deleteMember = function(groupIdentifier,userId,callback){
    var id;
    if(groupIdentifier.length < 12) 
        id = new require('mongoose').Types.ObjectId("123456789012")
    else{
        id = new require('mongoose').Types.ObjectId(groupIdentifier)
    }
    UsersGroup.findOne({
        $or : [
        { _id : id },
        {name:groupIdentifier}]
    },"",function(err,userGroup){
        if(userGroup){
            var index = userGroup.members.indexOf(userId);
            if(index > -1){
                userGroup.members.splice(index,1);            
            }
            userGroup.save(function(err,data){
                if(!err){
                    callback(null,data)
                }else{
                    callback(err);
                }
            })
        }else{
            callback({
                'err' : 'No Group exists by that ID'
            });
        }
    })
}

var UsersGroup =  mongoose.model('usersGroupSchema',usersGroupSchema);
module.exports = UsersGroup;


//Tests


// UsersGroup.CreateNewUserGroup('yoyo',function(err,data){
//     if(!err){
//         console.log('User Group Created')
//     }
// })


// UsersGroup.getUserGroups(function(err,data){
//     console.log(err);
//     console.log(data[0].members);
// })


// UsersGroup.getMembers("57f8bbc4b253db0c29236c14",function(err,data){
//     if(!err){
//         console.log(data);
//     }else{   
//         console.log(err)
//     }
// })

// UsersGroup.addMember("yoyo","5753c2c3e51866d01c72775a",function(err,data){
//     if(!err){
//         console.log('New User Added to the group!')
//     }else{   
//         console.log(err)
//     }
// })

// UsersGroup.addMember("yoyo","572b872461e17783b832450978",function(err,data){
//     if(!err){
//         console.log('New User Added to the group!')
//     }else{
//         console.log(err)
//     }
// })


// UsersGroup.deleteMember("57f8a7d9b443ef982027b676","572b872461e183b832450978",function(err,data){
//     console.log(err);
//     console.log(data);
    
// })