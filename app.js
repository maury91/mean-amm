var express 		= require('express'),
	fs 				= require('fs'),
	join 			= require('path').join,
	session 		= require('express-session'),
	passport 		= require('passport'),
	cookieParser 	= require('cookie-parser'),
	config 			= require('./config.json'),
	params 			= require('./node/params'),

	app 			= express();

//Check if is in debug mode
DEBUG = (params.NODE_ENV&&(params.NODE_ENV.toLowerCase() == 'test'))==true;

//Connect to database
var mongo 	= require('./node/mongo')(config,DEBUG);

//Load all the database models (exists an order)
fs.readdirSync(join(__dirname, 'node/models')).sort().reverse().forEach(function (file) {
	if (~file.indexOf('.js')) require(join(__dirname, 'node/models', file));
});

//Static
app.use(express.static('_static'));

//Passport
require('./node/passport')(passport);

app.use(cookieParser(config.cookieSecret));
app.use(session({
	secret : config.sessionSecret,
	resave : true,
	saveUninitialized : true
}));
app.use(passport.initialize());
app.use(passport.session());

//Routes
require('./node/routes/')(app,passport);

module.exports = app;