module.exports = function(app,passport) {

	app.use('/user',require('./user')(passport));
	app.use('/event',require('./event'));
	app.use('/position',require('./position'));

}