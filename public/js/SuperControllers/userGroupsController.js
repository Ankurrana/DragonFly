Superapp.controller('userGroupsController',['$scope','$http','$cookies','$resource','$route','$window',
'$rootScope','UserGroups','Users',
function($scope,$http,$cookies,$resource,$route,$window,$rootScope,UserGroups,Users){
	$scope.formName = "Create User Group"
    var users;

    fetchUserGroups = function(){
        UserGroups.get({
        },function(data){
            Users.get({},function(users){
                
                data.forEach(function(group) {

                    var usersToBeAdded = users.filter(function(user){
                        for(var i=0;i<group.members.length;i++){
                            if( user._id == group.members[i]._id ){
                                return false;
                            }
                        }
                        return true;
                    })
                  
                    
                    for(var i=0;i<usersToBeAdded.length;i++){
                        usersToBeAdded[i].text = usersToBeAdded[i].name;
                        usersToBeAdded[i].value = usersToBeAdded[i]._id;
                        usersToBeAdded[i].isSelected = false
                        group.members.push(usersToBeAdded[i])
                    }
                
                    group.members.forEach(function(user){
                            if(user.text == undefined) 
                                user.text = user.name;
                            if(user.value == undefined)                             
                                user.value = user._id;
                            
                            if(user.isSelected==undefined)                             
                                user.isSelected = true;
                            user.groupId = group._id;
                            user.groupName = group.name;
                            user.update = function(){
                                console.log(this.groupName);
                                console.log(this.groupId);  
                                UserGroups.update({
                                    groupId : this.groupId,
                                    userId : this._id,
                                    action : this.isSelected?0:1
                                },function(data){
                                    console.log(data);
                                    updateView();
                                })
                            }


                    })
                    group.groupClick = function(){
                        console.log(this.members);
                        $scope.datasource = {
                            "descriptionString" : "Group Selected : " +  this.name,
                            "columnName" : 'Users',
                            "rows" : this.members
                        }
                    }
                }, this);
                $scope.userGroups = data;
                $scope.userGroups[0].groupClick();
            })             
        })  
    }
     $scope.submitNewGroup = function(){
        if($scope.GroupName){
            UserGroups.save({
                'name' : $scope.GroupName
            },function(data){
                if(data){
                    updateView();
                }
            },function(){
                console.log('Failed!');
            })   
        }
    }

    var updateView = function(clearForm = true){
        if(clearForm){
            $scope.GroupName = "";
        }
        fetchUserGroups();
    } 
    $scope.datasource = {
        "descriptionString" : "Group Selected : ",
        "columnName" : 'Users',
        "rows" : []
    }
    $scope.context = "User Group Selection"   
    updateView();

}])



var filter = function(){

}