angular.module("NodeAmm")
	.factory('Animation',function AnimationFactory($rootScope){
		$rootScope.$on("$locationChangeStart",function(event,newUrl,oldUrl){
			var home_regex = new RegExp(/home/),
				search_regex = new RegExp(/search/),
				admin_regex = new RegExp(/admin/);
			$('html').removeClass('nav_animation home_search_animation');
			if (search_regex.test(newUrl)&&home_regex.test(oldUrl)) {
				//Searching a value in the home
				$('html').addClass('home_search_animation');
			} else if (home_regex.test(newUrl)&&search_regex.test(oldUrl)) {
				//Coming back from searching
				$('html').addClass('search_home_animation');
			} else if (search_regex.test(newUrl)&&search_regex.test(oldUrl)) {
				//Refine search
			} else if (admin_regex.test(newUrl)&&admin_regex.test(oldUrl)) {
				//Navigatin in the Admin area
			} else {
				//Navigating in the other pages, this pages can be animated
				$('html').addClass('nav_animation');
			}
		});
		return false;
	});