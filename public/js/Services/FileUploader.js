app.service('FileUploader',['$resource','$cookies',function($resource,$cookies){
	return $resource('/api/files/:key/:id',{'key':'@key','id':'@id'},{
			'get' : { 'method' : 'GET' , 
				headers : {
					'jwt' : $cookies.get('token')
				}
			},
			'save' : {
				'method' : 'POST',
				'headers' : {
					'jwt' : $cookies.get('token'),
					'Content-Type': undefined,
					'transformRequest': angular.identity
				}
				
			}
		}
	);
}])