angular.module('NodeAmm').controller('SearchResultController', function($scope,$resource,$routeParams,$timeout,$location,$http,Language){
	function updateResults() {
		var params = $location.search(),
			animation = false,
			afterAnimation;
		day = Language.strings.search.days.indexOf(params.day);
		type = Language.strings.search.types.indexOf(params.type);
		//Show results
		if ($scope.results.length) {
			animation = true;
			$('.results ul').fadeOut(300,function(){
				if (afterAnimation)
					afterAnimation();
				animation = false;
			});
		}
		$http.get('/event/search/'+day+'/'+type+'/'+params.position).then(function(ev){
			if (animation)
				afterAnimation = function() {
					$scope.results = ev.data;
					$scope.$digest();
					$('.results ul').fadeIn(300);
				}
			else
				$scope.results = ev.data;
		});
		//Use resource give an ugly flash while updating the data
		//$scope.results = $resource('/event/search/'+day+'/'+type+'/'+params.position).query();
	}
	//Default results
	$scope.results = [];
	//Obtain language data
	if (Language.strings.search)
		updateResults();
	else 
		var unsubscribeMe = $scope.$on('lang:updated',function(){
				updateResults();
				unsubscribeMe();
			});
	//Search change
	$scope.$watch(function(){ return $location.search() }, updateResults,true);
	//Language
	$scope.nothing_founded = Language.search?Language.strings.search.nothing:"";
	$scope.$on('lang:updated', function(){
		$timeout(function(){
			$scope.nothing_founded = Language.strings.search.nothing;
		});
	});
});