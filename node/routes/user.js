var express = require('express'),
	router 	= express.Router(),
	bodyParser 	= require('body-parser'),
	parseUrlencoded = bodyParser.urlencoded({extended : false});

module.exports = function(passport){
	router.post('/login',parseUrlencoded, function(req,res,next) {
		passport.authenticate('local', function(err,user,info) {
			if (err) 
				return res.json({err : err});
			if (!user)
				return res.sendStatus(422);
			req.login(user,function(err){
				if (err)
					return console.log(err);
				res.sendStatus(200);
			});
		})(req,res,next);
	});
	router.get('/logout', function(req,res,next) {
		req.logout();
		res.sendStatus(200);
	});
	router.get('/current',function(req,res,next){
		if (req.isAuthenticated())
			return res.sendStatus(200);
		res.sendStatus(401);
	});

	return router;
};