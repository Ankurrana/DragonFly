app.controller('searchBoxController',['$scope','$http','$cookies','$resource','$rootScope','Task',function($scope,$http,$cookies,$resource,$rootScope,Task){
    $scope.labels.searchString = "searchString";
    $scope.search = {};
    
    $scope.search.results = [];
    $scope.search.search = function(){
        if($scope.search.query.length < 3) {
            $scope.search.results = [];
            return;    
        };
        $http({
            method : 'GET',
            url : '/api/search/' + $scope.search.query,
            headers : {
                'jwt' : $cookies.get('token')
            }
        }).then(function(data){
            data.data.forEach(function(task){

                task.description = task.description.replace(new RegExp($scope.search.query),function(match){
                    return "<b>" + match + "</b>"
                })

                task.onclick = function(){
                    $rootScope.$broadcast('showDetails',this.key);
                }
            })
            
            $scope.search.results = data.data;
            console.log(data);
        },function(){
            console.log('Error : Response not recieved. Check Connection')
        })
    }
}])
