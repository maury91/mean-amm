var mongoose = require('mongoose');
var LocalStrategy = require('passport-local').Strategy;
var User = mongoose.model('User');

module.exports = function(passport) {
	// serialize sessions
	passport.serializeUser(function(user, done) {
		done(null, user.id)
	});

	passport.deserializeUser(function(id, done) {
		User.findById(id, function (err, user) {
			done(err, user);
		});
	});

	//Local strategy
	passport.use(new LocalStrategy({
        usernameField : 'username',
        passwordField : 'password'
    },function(username, password, done) {
		User.load(username, function (err, user) {
			if (err) return done(err)
			if (!user) {
				return done(null, false,{});
			}
			user.authenticate(password).then(function(valid){
				if (valid)
					return done(null, user);
				done(null, false,{err:''});
			},function(err){
				return done(null,false,{});
			});		
		});
	}));
}