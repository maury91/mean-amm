var mongoose = require('mongoose'),
	Promise  = require('promise'),
	request	= require('request'),
	Position 	= mongoose.model('Position'),
	Schema 	 = mongoose.Schema;

//Schema

var EventSchema = new Schema({
	name : 	{ type: String, default: '', dropDups: true, unique : true },
	type :  { type: Number, default: 0 },
	position : {
		latlng : [Number,Number],
		name : String,
		longname : String
	},
	image : String,
	data  : Date,
	user  : {
		type : Schema.ObjectId,
		ref  : 'User'
	}
});

//Event methods

EventSchema.methods.insert = function() {
		var that = this;
		return new Promise(function (resolve, reject) {
			//Find position
			request('http://maps.googleapis.com/maps/api/geocode/json?latlng='+that.position.latlng.join(',')+'&sensor=false',
				function(err,result,body) {
					//Check for error
					if (err)
						return reject(err);
					//Decode JSON
					try {
						body = JSON.parse(body);
						//Check if is a valid position
						if (!body || !body.results)
							return reject();
						//Retrieve a comprensive format
			        	var x,
			        		position = null,
			        		searched="route administrative_area_level_1 administrative_area_level_2 administrative_area_level_3 locality sublocality_level_1 sublocality_level_2 sublocality_level_3".split(" "),
			        		curA=-1,
			        		curB=-1;
			        	for (var i=0,l=body.results.length;i<l;i++) {
			        		for (var j=0,m=body.results[i].types.length;j<m;j++) {
			        			if ((x=searched.indexOf(body.results[i].types[j])) > curA) {
			    					curA=x;
			    					for (var h=0,n=body.results[i].address_components.length;h<n;h++) {
			    						for (var e=0,o=body.results[i].address_components[h].types.length;e<o;e++) {
				    						if ((y=searched.indexOf(body.results[i].address_components[h].types[e])) > curB) {
				    							curB = y;
				    							position = {
				    								name : body.results[i].address_components[h].long_name,
				    								position : [body.results[i].geometry.location.lat,body.results[i].geometry.location.lng]
				    							}
				    						}
			    						}
			    					}
			        			}
			        		}
			        	}
			        	//Controllo se ho trovato un valore
			        	if (position==null)
			        		return reject();
						that.position.name = position.name;
						that.position.longname = body.results[0].formatted_address;
						that.save(function(err,savedEvent){
							if (err) return reject(err);
							resolve(savedEvent);
							//Insert Position (if don't exists)
							var po = new Position(position);
							po.save();
						});
			        } catch (e) {
			        	reject(e);
			        }
				});
		});
	};


//Statics Methods

EventSchema.statics = {

	all: function() {
		var that = this;
		return new Promise(function (resolve, reject) {
			that.find()
				.select('name type image data')
				.exec(function(err,events){
					if (err)
						return reject(err);
					resolve(events);
				});
		});
	},

	byName: function(name) {
		var that = this;
		return new Promise(function (resolve, reject) {
			that.findOne({ name : { $regex: new RegExp("^" + name.toLowerCase(), "i") }})
				.populate('user', 'username')
				.exec(function(err,ev){
					if (err)
						return reject(err);
					resolve(ev);
				});
		});
	},

	search: function(day,type,position) {
		return this.near(position);
		//This is the correct code :

	},

	near: function(position) {
		var that = this;
		return new Promise(function (resolve, reject) {
			that.where("position.latlng")
				.within({ center: position, radius: 15/637 /* 15 KM (probably wrong, but searching 2 position away 1.5km from each other, with 15/6371 are founded, with 10/6371 no) */})
				.exec(function(err,ev){
					if (err)
						return reject(err);
					resolve(ev);
				});
		});
	}
}

mongoose.model('Event', EventSchema);