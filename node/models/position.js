var mongoose = require('mongoose'),
	Promise  = require('promise'),
	Schema 	 = mongoose.Schema;

//Schema

var PositionSchema = new Schema({
	name : 	{ type: String, default: '', dropDups: true, unique : true },
	position : [Number,Number]
});

//Event functions

PositionSchema.statics = {

	all: function () {
		var that = this;
		return new Promise(function (resolve, reject) {
			that.find()
				.select('name')
				.exec(function(err,events){
					if (err)
						return reject(err);
					resolve(events);
				});
		});
	},

	byName: function (name) {
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
	}
}

mongoose.model('Position', PositionSchema);