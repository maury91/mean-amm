var mongoose 	= require('mongoose'),
	express = require('express'),
	router 	= express.Router(),
	bodyParser 	= require('body-parser'),
	Event 		= mongoose.model('Event'),
	Position 	= mongoose.model('Position'),
	parseUrlencoded = bodyParser.urlencoded({extended : true});


/**
 * requireLogin Middleware
 */
function requireLogin (req, res, next) {
	if (req.isAuthenticated()) return next()
	res.sendStatus(401);
}

router.route('/')
	//Get all events
	.get(function(req,res) {
		//Get list of all events
		Event.all().then(function(events){
			res.json(events);
		},function(err){
			return res.sendStatus(404);
		})
	})
	//Insert new event
	.post(requireLogin,parseUrlencoded, function(req,res,next) {
		//Validation
		if (!req.body.name.length || !req.body.image.length || !req.body.position.lat || !req.body.position.lng)
			return res.sendStatus(400);
		req.body.position.latlng = [req.body.position.lat,req.body.position.lng];
		req.body.user = req.user;
		delete req.body.position.lat;
		delete req.body.position.lng;
		var ev = new Event(req.body);
		ev.insert().then(function(savedData){
    		res.json(savedData);						
		},function(err){
			res.sendStatus(409);
		});
	});

router.route('/:name')
	//Include event information
	.all(function(req,res,next){
		Event.byName(req.params.name).then(function(event){
			req.event = event;
			next();
		},function(){
			res.sendStatus(404);
		});
	})
	//Details of an event		
	.get(function(req,res) {
		res.json(req.event);
	})
	//Delete an event
	.delete(requireLogin,function(req,res) {
		//Delete event
		req.event.remove(function(err){
			if (err)
				return res.sendStatus(500);
			res.sendStatus(200);
		})
	});

router.get('/near/:name',function(req,res){
	//Obtain position
	Position.byName(req.params.name).then(function(pos){
		//Position founded
		Event.near(pos.position).then(function(events){
			//Events founded
			res.json(events);
		},function(){
			//Events not founded
			res.sendStatus(404);
		});
	},function(){
		//Position not founded
		res.sendStatus(404);
	});
});

router.get('/search/:day/:action/:position',function(req,res){
	//Obtain position
	Position.byName(req.params.position).then(function(pos){
		//Position founded
		Event.search(req.params.day,req.params.action,pos.position).then(function(events){
			//Events founded
			res.json(events);
		},function(){
			//Events not founded
			res.sendStatus(404);
		});
	},function(){
		//Position not founded
		res.sendStatus(404);
	});
});
	

module.exports = router;