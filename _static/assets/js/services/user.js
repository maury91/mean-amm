angular.module("NodeAmm")
	.factory('User',function UserFactory($http,$rootScope){
		var UserService = {
				logged : false,
				setLogged  : setUser
			};
		//Broadcast change to the user
		function setUser(logged) {
			UserService.logged = logged;
			$rootScope.$broadcast('user:updated',logged);
		}
		//Update initial value
		$http.get('/user/current').then(function(){
			setUser(true);
		});	
		return UserService;
	});