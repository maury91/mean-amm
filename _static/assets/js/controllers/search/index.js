angular.module('NodeAmm').controller('SearchIndexController', function($scope,$timeout,$routeParams,$location,Language,Positions){
	//If exists some values from the route
	if ($routeParams.day) {
		$scope.day  = $routeParams.day;
		$scope.type  = $routeParams.type;
		$scope.zone = $routeParams.position;
		//Watch event for live update
		$scope.$on('naselector:updated', function(event){
			$timeout(function(){
				//Wait for the animation
				setTimeout($scope.search,500);
			});
		});
	} else {
		//Use default values
		$scope.day = "";
		$scope.type = "";
		$scope.zone = "";
	}
	//Default language data
	$scope.goto = Language.strings.search?Language.strings.search.goto : "";
	$scope.near = Language.strings.search?Language.strings.search.near : "";
	//Load Lang Values
	$scope.days = Language.strings.search?Language.strings.search.days : [];
	$scope.types = Language.strings.search?Language.strings.search.types : [];
	$scope.zones = Positions;
	$scope.$on('lang:updated', function(event,newStrings){
		$timeout(function(){
			$scope.days = newStrings.search.days;
			$scope.types = newStrings.search.types;
			$scope.goto = newStrings.search.goto;
			$scope.near = newStrings.search.near;
			$scope.$digest();
		});
	});
	//Update search selectors when path change (like user navigating back)
	$scope.$watch(function(){ return $location.search() }, function(){
		var params = $location.search();
		$scope.day  = params.day;
		$scope.type  = params.type;
		$scope.zone = params.position;
	},true);
	//Search button
	$scope.search = function () {
		//Be sure to receive all $scope updates
		$timeout(function(){
			if (!(new RegExp("/search($|/)")).test($location.path()))
				$location.url('/search');
			$location.search({
				day:$scope.day,
				type:$scope.type,
				position:$scope.zone
			});
		});
	};
});