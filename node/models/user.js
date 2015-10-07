var mongoose = require('mongoose'),
	bcrypt 	 = require('bcrypt-nodejs'),
	Promise  = require('promise'),
	Schema 	 = mongoose.Schema;


//Schema

var UserSchema = new Schema({
	username: 	{ type: String, default: '', dropDups: true, unique : true },
	authToken: 	{ type: String, default: '' },
	hashed_password: 	{ type: String, default: '' }
});

//Virtual

UserSchema
	.virtual('password')
	.set(function(password) {
		var that = this;
		this._password = password;
		bcrypt.hash(password,null,null, function(err, hash) {
			if (err) throw err;
			that.hashed_password = hash;
		});
	})
	.get(function() { return this._password });

//Methods

UserSchema.methods = {

	authenticate: function (plain) {
		var hashedPassword = this.hashed_password;
		//Async
		return new Promise(function(resolve,reject){
			//Compare hashed password with plain password
			bcrypt.compare(plain, hashedPassword, function(err, res) {
				if (err)
					return reject(err);
				resolve(res);
			});
		});
	}
}


//Load users

UserSchema.statics = {

	load: function (username, cb) {
		this.findOne({ username : username})
			.select('username hashed_password')
			.exec(cb);
	}
}

mongoose.model('User', UserSchema);