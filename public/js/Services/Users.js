Superapp.service('Users',['$resource','$cookies',function($resource,$cookies){
	return $resource('/superapi/users/:userId',{'username':'@username','userid':'@userId'},{
			'get' : { 'method' : 'GET' , 
				headers : {
					'jwt' : $cookies.get('token')
				},
				isArray: true
			},
			'getOne' : {
				'method' : 'GET',
				'headers' : {
					'jwt' : $cookies.get('token')
				}  
			},
			'save' : {
				'method' : 'POST',
				'headers' : {
					'jwt' : $cookies.get('token')
				}
			},
			'update' : {
				'method' : 'PUT',
				'headers' : {
					'jwt' : $cookies.get('token')
				}
			},
			'delete' : {
				method : 'delete',
				headers : {
					'jwt' : $cookies.get('token')
				}
			}
		}
	);
}])
