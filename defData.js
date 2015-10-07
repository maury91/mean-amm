/**
 * This script insert some default data to the application
 */

var app = require('./app.js'),
	mongoose 	= require('mongoose'),
	async 		= require('async'),
	User 		= mongoose.model('User'),
	Event 		= mongoose.model('Event');

var defUser = new User({
		username : "admin",
		password : "123456"
	}),
	events = [
		{ name: 'Campagna Paese',
			type: '1',
			position:
			{ 
				latlng: ['39.956983','8.670916']
			},
			image: 'none',
			data: new Date()
		},
		{ name: 'Centro Paese',
			type: '1',
			position:
			{ 
				latlng: ['39.955051, 8.671839']
			},
			image: 'none',
			data: new Date()
		},
		{ name: 'Ingresso Zerfaliu',
			type: '1',
			position:
			{ 
				latlng: ['39.957974',' 8.707069']
			},
			image: 'none',
			data: new Date()
		},
		{ name: 'Torre Oristano',
			type: '1',
			position:
			{ 
				latlng: ['39.905051',' 8.592019']
			},
			image: 'none',
			data: new Date()
		},
		{ name: 'Ingresso Oristano da Sili',
			type: '1',
			position:
			{ 
				latlng: ['39.911158',' 8.603757']
			},
			image: 'none',
			data: new Date()
		},
		{ name: 'IperStanda Oristano',
			type: '1',
			position:
			{ 
				latlng: ['39.916247',' 8.584568']
			},
			image: 'none',
			data: new Date()
		}
	];
defUser.save(function(err,userInfo){
	console.log(err?'Duplicated User':'User Inserted');
	var funcs = [];
	for (var i = 0;i<events.length;i++)
		funcs.push((function(ev){
			return function(done) {
				ev.user = defUser._id;
				var Ev = new Event(ev);
				Ev.insert().then(function(){
					console.log(ev.name+" Inserted");
					done();
				},function(err){
					console.log(ev.name+" Duplicated");
					done();
				});
			};
		})(events[i]));
	async.parallel(funcs,function(){
		console.log('All events inserted');
		process.exit();
	});
});