module.exports = function(config){
	config.set({
		//plugins:['karma-mocha','karma-phantomjs-launcher'],
		browsers:['PhantomJS'],
		frameworks:['mocha'],
		reporters:['mocha'],
		files:[
			"bower_components/angular/angular.js",
			"bower_components/angular-mocks/angular-mocks.js",
			"bower_components/chai/chai.js",

			"_static/assets/js/*.js",
			"_static/assets/js/controllers/**/*.js",
			"_static/assets/js/directives/**/*.js",
			"_static/assets/js/filters/**/*.js",
			"_static/assets/js/resources/**/*.js",
			"_static/assets/js/services/**/*.js",
			
			"test-frontend.js"
		]
	})
}