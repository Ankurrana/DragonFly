Superapp.directive('listBox',function(){
	return {
		'templateUrl' : 'public/views/common/listBox.html',
		'scope' : {
			'datasource' : '=' 
		},
        'controller' : function($scope){
            // console.log($scope.datasource)
             var test = function(val){
                var re = new RegExp($scope.filter);                
                if (re.test(val)) {
                   return true;
                } else {
                   return false;
                }
            }
         
            function compare(a,b) {
                if (a["text"] < b["text"])
                    return -1;
                if (a["text"] > b["text"] || a["isSelected"] && !b["isSelected"] )
                    return 1;
                return 0;
            }
            $scope.datasource.rows.sort(compare);
          
                
            
            $scope.refresh = function(){
                for(var i=0;i<$scope.datasource.rows.length;i++){
                    $scope.datasource.rows[i].visible = test($scope.datasource.rows[i].text);
                }
                 $scope.datasource.rows.sort(compare);
            }
            $scope.$watch('filter',function(){
                $scope.refresh();                
            })


            $scope.$watch('datasource',function(){
                $scope.refresh();
            })
            
        }	
	}
})
