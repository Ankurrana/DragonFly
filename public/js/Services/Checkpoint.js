app.service('Checkpoint',['$resource','$cookies',function($resource,$cookies){
	return $resource('/api/checkpoints/:key/:id',{'id':'@id','key':'@key'},{
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
			},
			'changeStatus' : {
				'method' : 'PUT',
				'headers' : {
					'jwt' : $cookies.get('token')
				}
			}
		}
	);
}])