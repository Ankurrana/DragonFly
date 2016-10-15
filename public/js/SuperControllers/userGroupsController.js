Superapp.controller('userGroupsController',['$scope','$http','$cookies','$resource','$route','$window',
'$rootScope','UserGroups','Users',
function($scope,$http,$cookies,$resource,$route,$window,$rootScope,UserGroups,Users){
	$scope.formName = "Create User Group"
    var users;
    
    fetchUserGroups = function(){
        UserGroups.get({
        },function(data){
            Users.get({},function(users){

                // console.log(data);
                // console.log(users);
                
                for(var j=0;j<data.length;j++){
                    var group = data[j];
                    
                    
               
                    group.addedUsers = [];  
                    console.log("Group: 1 ")
                    console.log(group);
                    var usersToBeAdded = users.filter(function(user){
                        for(var i=0;i<group.members.length;i++){
                            if( user._id == group.members[i]._id ){
                                return false;
                            }
                        }
                        return true;
                    })
                    
                    for(var i=0;i<usersToBeAdded.length;i++){                       
                        k =  new user(
                            usersToBeAdded[i]._id,
                            usersToBeAdded[i].name,
                            group._id,
                            group.name,
                            false,
                            UserGroups);

                        group.addedUsers.push(k);
                        k.toString();
                    }
                    // console.log("Group: 2 ")
                    // console.log(group);
                
                    for(var i=0;i<group.members.length;i++){
                         var kUser =  new user(
                                    group.members[i]._id,
                                    group.members[i].name,
                                    group._id,
                                    group.name,
                                    true,
                                    UserGroups);

                           group.addedUsers.push(kUser);
                           kUser.toString();
                    }
                    // console.log("Group: 3 ")
                    // console.log(group);
                 
                    group.groupClick = function(){
                        
                        $scope.datasource = {
                            "descriptionString" : "Group Selected : " +  this.name,
                            "columnName" : 'Users',
                            "rows" : this.addedUsers
                        }
                    }
                }
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
    // $scope.context = "User Group Selection"   
    updateView();



}])

var user = function(_id,_name,_groupId,_groupName,_isSelected,UserGroupsService){
    this.name  = _name;
    this.id = _id;
    this.groupId = _groupId;
    this.groupName = _groupName;
    this.isSelected = _isSelected;
    this.text = _name;
    this.value = _id;
    this.addFunctionality = function(funcName, funcImp){
        this[funcName]  = funcImp;
    }
    this.update = function(){
        UserGroupsService.update({
            groupId : this.groupId,
            userId : this.id,
            action : this.isSelected?0:1
        },function(data){
            this.isSelected = !this.isSelected;
            console.log("Updated : ");
            console.log(data);
        })
    }
    this.toString = function(){
        console.log(this.name);
        console.log(this.isSelected);
    }
}  


// var myuser  = new user(123,"Ankur");
// var akshay = new user(124,"Akshay");
// arr = [1,2,3];
// ars = [4,5,6];
// myuser.addFunctionality("getName",function(asd){
//     return this.name + " " + this.id  + " " + asd[2];
// })
// akshay.addFunctionality("getName",function(asd){
//     return this.name + " " + this.id  + " " + asd[2];
// })
// console.log(myuser.getName(arr));  
// console.log(akshay.getName(ars));
// console.log(myuser);     