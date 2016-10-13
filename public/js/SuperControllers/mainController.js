
Superapp.controller('mainController',['$scope','$http','$cookies','$resource','$route','$window','$rootScope',function($scope,$http,$cookies,$resource,$route,$window,$rootScope){
	var loadPage = function(page){
        console.log(page);
        $scope.title = page.title;
        $scope.rightPanelURL = page.url;
    }
    
    var SettingsPages = [
        {
            "url" : "public/views/userGroups.html",
            "title" : "User Groups"
        },
        {
            "url" : "public/views/userGroups.html",
            "title" : "General Settings"
           
        }
    ]
    $scope.sideBarURL = "public/views/sidebar.html";
    $scope.rightPanelURL = SettingsPages[0].url;
    $scope.settingPages = SettingsPages;    
    
    

    $scope.settingsPages = SettingsPages;
    $scope.changeSettingsPage = function(pageName){
        var profile;
        if(SettingsPages[pageName]){
            profile = SettingsPages[pageName];
            $scope.title = profile.title;
            $scope.rightPanelURL = profile.url;
        }
    }
    $scope.changeSettingsPage("userGroups");
   
}])