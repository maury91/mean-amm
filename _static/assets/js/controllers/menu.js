angular.module('NodeAmm').controller('MenuController', function($timeout,$scope,$location,Language,User){
	//Set default values for the home fields
	var menuButtons = ["Home","Login","Admin"];
	$scope.menu = menuButtons;

	//Change the content of the menu
	function updateMenu() {
		$timeout(function(){
			$scope.menu = {};
			for (var i in menuButtons) {
				$scope.menu[menuButtons[i]]  = {
					text : Language.strings.menu[menuButtons[i]],
					visible : 
						//Don't show navigation link for current page
						!(new RegExp("/" + menuButtons[i].toLowerCase() + "($|/)").test($location.path()))&&(
							User.logged?
								//If is logged don't show login link
								(menuButtons[i] !== "Login"):
								//If is not logged don't show admin link
								(menuButtons[i] !== "Admin"))
						//Home have 2 names
						&&((menuButtons[i].toLowerCase() != 'home')||!(new RegExp(/search/).test($location.path())))
				};
			}
			$scope.$digest();
		});
	}
	//When the language change, update which elements are visible
	$scope.$on('lang:updated', updateMenu);
	//When the user change, update which elements are visible
	$scope.$on('user:updated', updateMenu);
	//When the route change, update which elements are visible
	$scope.$on('$routeChangeStart', function(){
		//Time for animation
		setTimeout(updateMenu,1700);
	});
	updateMenu();
})