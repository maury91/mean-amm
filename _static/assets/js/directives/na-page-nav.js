angular.module('NodeAmm')
	.directive('naPageNav', function($http){
		return {
			controller: 'MenuController',
			restrict: 'E',
			templateUrl: 'assets/templates/directives/nav.html',
			replace: true
		};
	});