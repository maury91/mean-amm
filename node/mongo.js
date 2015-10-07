var mongoose = require('mongoose');

module.exports = function(config,DEBUG) {
	// Connect to database
	var connect = function () {
		var dburl;
		//Check for heroku mongodb var
		if (process.env.MONGOHQ_URL)
			dburl = process.env.MONGOHQ_URL;
		else 
			dburl = 'mongodb://localhost/' + (DEBUG?'amm_test':'amm');
		if (DEBUG)
			console.log('Working on the test enviroment\n'+dburl);
		mongoose.connect(dburl, { server: { socketOptions: { keepAlive: 1 } } });
	};
	connect();

	mongoose.connection.on('error', console.log);
	mongoose.connection.on('disconnected', connect);

	return mongoose;
}