app.service('Task',['$resource','$cookies',function($resource,$cookies){
	return $resource('/api/tasks/:key',{'date':'@date','key':'@key'},{
			'get' : { 'method' : 'GET' , 
				headers : {
					'jwt' : $cookies.get('token')
				},
				isArray:true
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
			}
		}
	);
}])