
Superapp.controller('mainController',['$scope','$http','$cookies','$resource','$route','$window','$rootScope',function($scope,$http,$cookies,$resource,$route,$window,$rootScope){
    var settingsPage = function(title,url){
        this.url = url;
        this.title = title;
        this.openPage = function(){
            $scope.title = this.title;
            $scope.rightPanelURL = this.url;
        }
    }
    
    var SettingsPages = [
        new settingsPage("User Groups","public/views/userGroups.html"),
        new settingsPage("User Groups","public/views/userGroups.html"),
        new settingsPage("Assign Permissions","public/views/assignPermissions.html")
    ]
    $scope.sideBarURL = "public/views/sidebar.html";
    $scope.rightPanelURL = SettingsPages[0].url;
    $scope.settingPages = SettingsPages;    
    
    

    $scope.settingsPages = SettingsPages;
   
}])


