angular.module('NodeAmm').controller('LoginController', function($timeout,$scope,Language,User){
	//Language
	$scope.login = Language.strings.login?Language.strings.login.login : "";
	$scope.username = Language.strings.login?Language.strings.login.username : "";
	$scope.password = Language.strings.login?Language.strings.login.password : "";
	$scope.$on('lang:updated', function(event,newStrings){
		$timeout(function(){
			$scope.login = Language.strings.login.login;
			$scope.username = Language.strings.login.username;
			$scope.password = Language.strings.login.password;
			$scope.$digest();
		});
	});
	buildInputs();
})

