
var group = function(_id, _name, _isSelected, userIdItIsAssignedTo,service){
    this.id = _id;
    this.name = _name;
    this.text = this.name;
    this.value = this.id;
    this.isSelected = _isSelected;
    this.userIdItIsAssignedTo = userIdItIsAssignedTo;
    this.groups;
    this.update = function(){
        service.update({
            groupId : this.id,
            userId : this.userIdItIsAssignedTo,
            action : !this.isSelected?1:0
        },function(data){
            console.log(data)
        })
    }
    this.toString = function(){
        console.log(
            this.name + " " + 
            this.id + " " + 
            this.isSelected
        )
    }
    
}


var AUTGUser = function(userId, username,clickFunction){
    this.id = userId;
    this.name = username;
    this.groups = [];
    this.addGroup = function(group){
        this.group.push(this.group);
    }
    this.click = clickFunction
}

 

Superapp.controller('assignUserGroupsController',['$scope','$http','$cookies','$resource','$route','$window',
'$rootScope','UserGroups','Users',
function($scope,$http,$cookies,$resource,$route,$window,$rootScope,UserGroups,Users){
	$scope.formName = "Assign User Groups to Users"
    var users;

    fetchUsers = function(){
        Users.get({},function(_users){
            console.log(_users);
            UserGroups.get({},function(_groups){
                console.log(_groups);
                var userObjects = [];
                _users.forEach(function(element) {
                    var userObject = new AUTGUser(element._id, element.name);
                    element.UserGroups.forEach(function(groupA){
                        userObject.addGroup( new  group(groupA._id, groupA.name, true,element._id,Users))
                    })  
                });                
            })               
        })
    }

    fetchUsers();


    $scope.datasource = {
        "descriptionString" : "User Selected : ",
        "columnName" : 'Users',
        "rows" : []
    }
    // $scope.context = "User Group Selection"   
    



}])



// _rows = []
//                     AllGroups.forEach(function(GroupItem){
//                          _rows.push(new group(
//                                 GroupItem._id,
//                                 GroupItem.name,
//                                 false,
//                                 user._id,
//                                 Users
//                             ))
//                     })




                    
//                      _users.forEach(function(user){
//                         user.userGroups.forEach(function(item){
//                             for(var j=0;j<_rows;j++){
                                
//                             }
//                          })
//                      }) 

//                     // for(var i=0;i<AllGroups.length;i++){
//                     //     var add = true;
//                     //     for(var j=0;j<_rows.length;j++){
//                     //         if( _rows[j].id == AllGroups[i]._id ){
//                     //             add = false;
//                     //         }
//                     //     }
//                     //     if(add){
//                     //         _rows.push(new group(
//                     //             AllGroups[i]._id,
//                     //             AllGroups[i].name,
//                     //             false,
//                     //             user._id,
//                     //             Users
//                     //         ))
//                     //     }
//                     // }
                    
                    
               
              
             
