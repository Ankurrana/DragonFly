app.service('Share',['$resource','$cookies',function($resource,$cookies){
	return $resource('/api/tasks/share/:key/:username',{'key':'@key','username':'@username'},{
			'share' : {
				method : 'get',
				headers : {
					'jwt' : $cookies.get('token')
				}
			}
		}
	);
}])