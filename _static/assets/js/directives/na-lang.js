angular.module('NodeAmm')
	.directive('naLangChooser', function(){
		return {
			controller: function($scope,$timeout,Language) {
				/**
				 * Convert from the form {default : "en", "it" : .. , "en" : ..} to ["en","it"]
				 */
				var languageSelected = '';
				function plainLangs(langs) {
					var ret=[];
					//The first in the list is the selected
					if (languageSelected)
						ret.push({
							name : languageSelected,
							selected : true
						});
					//Iterate all the languages
					for (var i in langs)
						if ((i !== "default")&&(i !== languageSelected))
							ret.push({
								name : i,
								selected : false
							});
					return ret;
				}
				languageSelected = Language.selected();
				$scope.langs = Language.list?plainLangs(Language.list):[];
				//Change the language clicking on the flag
				$scope.change_lang = function(newLang){
					if (newLang != Language.selected())
						Language.change(newLang);
				}
				$scope.$on('lang:loaded', function(event,langs){
					languageSelected = Language.selected();
					$timeout(function(){
						$scope.langs = plainLangs(Language.list);
						$scope.$digest();
					});
				});
				$scope.$on('lang:updated', function(event,langStrings,selected){
					languageSelected = selected;
					$timeout(function(){
						$scope.langs = plainLangs(Language.list);
						$scope.$digest();
					});
				});
			},
			restrict: 'E',
			templateUrl: 'assets/templates/directives/lang.html',
			replace: true
		};
	});