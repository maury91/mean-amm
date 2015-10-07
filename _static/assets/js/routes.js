angular.module('NodeAmm').config(['$routeProvider',function($routeProvider){
	$routeProvider
		.when('/', {
			redirectTo : '/home'
		})
		.when('/home', {
			templateUrl: "assets/templates/search/index.html",
			controller: "SearchIndexController"
		})
		.when('/search', {
			templateUrl: "assets/templates/search/result.html",
			controller: "SearchResultController",
			reloadOnSearch: false
		})
		.when('/search/:day/:type/:position', {
			templateUrl: "assets/templates/search/result.html",
			controller: "SearchResultController"
		})
		.when('/place/:id', {
			templateUrl: "assets/template/place/show.html",
			controller: "PlaceShowController"
		})
		.when('/login',{
			templateUrl: "assets/templates/login/index.html"
		})
		;
}]);