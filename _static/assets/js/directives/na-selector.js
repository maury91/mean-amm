angular.module('NodeAmm')
	.directive('naSelector', function($http,$rootScope){
		function selector_open(scope,elem) {
			var shadow = $('<div class="selector_list"/>'),
				opened= $('<div/>');
			//Populate the selector
			for (var i in scope.options) {
				var spn = $('<span/>').text(scope.options[i]).click((function(id) {
					//This clousure is for save the current value of the variable "i"
					return function() {
						//Update the selector text, and the selected option
						scope.selected = id;
						scope.value    = scope.options[id];
						elem.text(scope.options[id]).change();
						$(this).parent().children('span.selected').removeClass('selected');
						$(this).addClass('selected');
						$rootScope.$broadcast('naselector:updated');
					}})(i));
				//Add selected to the current selected element
				if (i == scope.selected)
					spn.addClass('selected');
				opened.append(spn);
			}
			//Make the backgound become more black
			shadow.append(opened).appendTo(elem.parent()).css('opacity', .3).animate({
				opacity : 1
			});
			//Calculate positions for the animation
			var offset = elem.offset(),
				animT = offset.top+elem.outerHeight()/2,
				animL = offset.left+elem.outerWidth()/2,
				wid = opened.width()+40,
				marL = -wid/2,
				marT = -opened.height()/2;
			//Respect margins of the page
			animT = (animT+marT>=0)?animT:-marT;
			animL = (animL+marL>=0)?animL:-marL;
			//Close when clicking outside the menu
			shadow.click(function(event) {
				shadow.animate({
					opacity: .3},
					//Alla fine dell'animazione di chiusura elimino tutto
					function() {
						$(this).remove();
				});
				//Animazione inversa (zoom out)
				opened.animate({
					fontSize: ".7em",
					width: wid*.7,
					marginLeft : marL*.7,
					marginTop : marT*.7
				});
			});
			//Apply initial size, and execute animation
			opened.css({
				fontSize: ".7em",
				width: wid*.7,
				top : animT,
				left : animL,
				marginLeft : marL*.7,
				marginTop : marT*.7
			}).animate({
				fontSize: "1em",
				width: wid,
				marginLeft : marL,
				marginTop : marT,
			});
		};
		return {
			scope: {
				options : '=',
				value   : '=',
				selected: '='
			}, 
			restrict: 'E',
			templateUrl: 'assets/templates/directives/selector.html',
			replace: true,
			link: function(scope, elem, iAttrs, controller) {
				//Initialize default selected value
				if (scope.selected == undefined)
					scope.selected = -1;
				//Watch for changes to the options
				scope.$watchCollection('options',function(newValue,oldValue){
					//If options is populated
					if (scope.options.length) {
						//If you use this selecter using the value attribute instead the selected attribute
						if ((!~scope.selected)&&(~scope.options.indexOf(scope.value))) 
							scope.selected = scope.options.indexOf(scope.value);
						else {
							//In case of no attribute (default is 0)
							if (!~scope.selected)
								scope.selected = 0;
							//Update the value to the selected element
							if (scope.options.length&&newValue[scope.selected]) 
								scope.value = newValue[scope.selected];
						}
					}
				});
				//Update content when selected value changes
				scope.$watch('selected',function(newValue){
					if (scope.options&&scope.options[scope.selected]) 
						scope.value = scope.options[scope.selected];
				});
				//Update content when value changes
				scope.$watch('value',function(newValue){
					if (~scope.options.indexOf(newValue)) 
						scope.selected = scope.options.indexOf(newValue);
				});
				//Click event
				elem.click(function(){
					selector_open(scope,elem);
				});
			}
		};
	});