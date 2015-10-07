angular.module('NodeAmm').controller('SearchIndexController', function($timeout,$scope,$http,Language){
	//Set default values for the home fields
	$scope.days = Language.strings.search?Language.strings.search.days : [];
	$scope.types = Language.strings.search?Language.strings.search.types : [];
	$scope.zones = [];

	//Default language data
	$scope.goto = Language.strings.search?Language.strings.search.goto : "";
	$scope.near = Language.strings.search?Language.strings.search.near : "";

	Language.watch(function(newStrings){
		$timeout(function(){
			$scope.days = newStrings.search.days;
			$scope.types = newStrings.search.types;
			$scope.goto = newStrings.search.goto;
			$scope.near = newStrings.search.near;
			$scope.$digest();
		});
	});
	//Load the values
	//Days is based on the language of the user
})