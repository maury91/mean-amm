var mongoose 	= require('mongoose'),
	express = require('express'),
	request	= require('request'),
	router 	= express.Router(),
	Position 	= mongoose.model('Position');


router.route('/')
	//Get all positions
	.get(function(req,res) {
		//Get list of all positions
		Position.all().then(function(positions){
			//I need only the name of the position
			var resPosition = [];
			for (var i=0,l=positions.length;i<l;i++)
				resPosition.push(positions[i].name);
			res.json(resPosition);
		},function(err){
			return res.sendStatus(404);
		})
	})

module.exports = router;