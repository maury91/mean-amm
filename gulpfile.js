var gulp = require('gulp'),
	browserSync = require("browser-sync"),
	nodemon = require('gulp-nodemon'),
	karma = require('karma').Server;

gulp.task('test-frontend',function(done){
	new karma({
		configFile: __dirname + '/karma.conf.js',
		singleRun: true,
		reporters:['mocha']
	},done).start();
});

gulp.task('visual-test-frontend',function(done){
	browserSync.init({
		notify:false,
		port:9999,
		server:{
			baseDir:["test","_static"],
			routes:{
				'/bower_components':'bower_components'
			}
		}
	});

	gulp.watch(['_static/**/*.*','test/*.*'])
		.on('change',browserSync.reload);
});

gulp.task("start-server", function () {
	nodemon({
		script: 'bin/www',
		ext: 'js html',
		env: { 
			'PORT' : 3001
		}
	})
})

gulp.task('open', ["start-server"], function (argument) {
	browserSync.init({
		notify:false,
		port:9998,
		proxy:"http://localhost:3001"
	});

	gulp.watch(['_static/**/*.*','test/*.*'])
		.on('change',browserSync.reload);
})
