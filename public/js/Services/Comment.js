app.service('Comment',['$resource','$cookies',function($resource,$cookies){
	return $resource('/api/comments/:key',{'key':'@key'},{
			'get' : { 'method' : 'GET' , 
				headers : {
					'jwt' : $cookies.get('token')
				},
				isArray:true
			},
			'save' : {
				'method' : 'POST',
				'headers' : {
					'jwt' : $cookies.get('token')
				}
			}
		}
	);
}])