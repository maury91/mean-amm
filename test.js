var mongoose 	= require('mongoose'),
	request 	= require('supertest'),
	async 		= require('async'),
	app 		= require('./app'),
	User 		= mongoose.model('User'),
	Position 	= mongoose.model('Position'),
	Event 		= mongoose.model('Event');

describe('User',function () {
	after(function(done){
		//Delete User
		User.collection.remove(function(){
			done();
		});
	})

	before(function(done){
		//Clear User Collection
		User.collection.remove(function(){
			done();
		});
	});

	it('Mongo can insert the user',function(done){
		//Insert a test user
		var user = new User({
				username : "test",
				password : "123456"
			});
		user.save(function(err){
			if (err)
				throw err;
			done();
		});
	});

	var agent = request.agent(app);

	it("Can't login with wrong password", function(done){
		agent
			.post('/user/login')
			.send('username=test&password=654321')
			.expect(422,done)
	});

	it("User is not authenticated", function(done){
		agent
			.get('/user/current')
			.expect(401,done)
	});

	it("Can login with correct password", function(done){
		agent
			.post('/user/login')
			.send('username=test&password=123456')
			.expect(200,done)
	});

	it("User is authenticated", function(done){
		agent
			.get('/user/current')
			.expect(200,done)
	});

	it("User can logout", function(done){
		agent
			.get('/user/logout')
			.expect(200,function(err){
				if (err)
					return done(err);
				agent
					.get('/user/current')
					.expect(401,done);
			});
	})
});

describe("Get events",function(){

	var agent = request.agent(app);

	before(function(done){
		//Delete Events Collection
		Event.collection.remove(function(){
			Event.count(function(err,count){
				//count must be 0
				EventsCount = count;
				done();
			});
		});
	});

	var lastHeaders,lastBody;

	it("return 200", function(done) {
		agent
			.get('/event')
			.expect(function(res){
				lastHeaders = res.headers;
				lastBody = res.body;
			})
			.expect(200,done)
	});

	it("content-type must be json", function(done) {
		if (!lastHeaders["content-type"].match(/json/i))
			return done(true);
		done();
	});

	it("length must be 0", function(done) {
		if (lastBody.length !== 0)
			return done(true);
		done();
	});	

});

describe("Events",function(){

	var agent = request.agent(app),
		EventsCount;

	before(function(done){
		async.parallel([
			function(done) {
				//Delete Events Collection
				Event.collection.remove(function(){
					Event.count(function(err,count){
						//count must be 0
						EventsCount = count;
						done();
					});
				});
			},
			function(done) {
				//Delete Positions Collectin
				Position.collection.remove(function(){
					done();
				});
			},
			function(done) {
				//Clear User Collection
				User.collection.remove(function(){
					//Insert a test user
					var user = new User({
							username : "test",
							password : "123456"
						});
					user.save(function(err){
						if (err)
							throw err;
						done();
					});
				});
			}
		],done);
	});

	var lastHeaders,lastBody;
	it("Guest can't insert new events",function(done){
		agent
			.post('/event')
			.send("name=Fake+Position&type=1&position[lat]=1&position[lng]=1&position[name]=none&position[longname]=none&image=none&data")
			.expect(401,done)
	});

	it("Check validation of events",function(done){
		agent
		.post('/user/login')
		.send('username=test&password=123456')
		.expect(200,function(err){
			if (err) {
				console.log("Can't Login");
				done(err);
			}
			agent
				.post('/event')
				.send("name=&type=1")
				.expect(400,done)
		});
	});

	it("User can insert new events",function(done){
		lastHeaders=null;
		lastBody=null;
		agent
			.post('/event')
			.send("name=Fake+Position&type=1&position[lat]=39.956983&position[lng]=8.670916&image=none&data="+(new Date()))
			.expect(function(res){
				lastHeaders = res.headers;
				lastBody = res.body;
			})
			.expect(200,done)
	});

	it("Response for new events must be json",function(done){
		if (typeof lastHeaders["content-type"] !== "string")
			return done(true);
		if (!lastHeaders["content-type"].match(/json/i))
			return done(true);
		done();
	});

	it("Response for new events must contain position.name and position.longname",function(done){
		if (!lastBody.position || !lastBody.position.name || !lastBody.position.longname)
			return done(true);
		done();
	});

	it("position.longname must contain 'solarussa'",function(done){
		if (!lastBody.position || !lastBody.position.name || !lastBody.position.longname)
			return done(true);
		if (!lastBody.position.longname.match(/solarussa/i))
			return done(new Error('Position is '+lastBody.position.name ));
		done();
	});
	
	it("The number of Events in the database is incremented by 1",function(done){
		Event.count(function(err,count){
			if (count != EventsCount+1)
				return done(new Error(count+' is different from '+(EventsCount+1)));
			done();
		});
	});

	it("The number of Position in the database must be 1",function(done){
		Position.count(function(err,count){
			if (count != 1)
				return done(new Error(count+' is different from 1'));
			done();
		});
	});

	it("Event.all length must be 1", function(done) {
		Event.all().then(function(events){
			if (events.length != 1)
				done("Length is "+events.length);
			done();
		});
	});

	it("Get events length must be 1", function(done) {
		request(app)
			.get('/event')
			.expect(200)
			.expect('content-type',/json/)
			.expect(function(res){
				if (res.body.length !== 1)
					return done(true);
				done();
			})
			.end();
	});

	it("Can't insert duplicate names", function(done) {
		agent
			.post('/event')
			.send("name=Fake+Position&type=1&position[lat]=39.955051&position[lng]=8.671839&image=none&data="+(new Date()))
			.expect(function(res){
				lastHeaders = res.headers;
				lastBody = res.body;
			})
			.expect(409,done);
	});

	it("Insert near event", function(done) {
		agent
			.post('/event')
			.send("name=Fake+Position+2&type=1&position[lat]=39.955051&position[lng]=8.671839&image=none&data="+(new Date()))
			.expect(function(res){
				lastHeaders = res.headers;
				lastBody = res.body;
			})
			.expect(200,done);
	});

	it("The number of Events in the database must be 2",function(done){
		Event.count(function(err,count){
			if (count != 2)
				return done(new Error(count+' is different from 2'));
			done();
		});
	});

	it("The number of Position in the database must be 1",function(done){
		Position.count(function(err,count){
			if (count != 1)
				return done(new Error(count+' is different from 1'));
			done();
		});
	});

	it("Get Position must be 1",function(done){
		request(app)
			.get('/position')
			.expect(200)
			.expect('content-type',/json/)
			.expect(function(res){
				if (res.body.length !== 1)
					return done(true);
				done();
			})
			.end();
	});

	it("Events near solarussa must return 200 JSON",function(done){
		request(app)
			.get('/event/near/solarussa')
			.expect(function(res){
				lastHeaders = res.headers;
				lastBody = res.body;
			})
			.expect("content-type",/json/)
			.expect(200,done);
	});

	it("Events near solarussa must be 2",function(done){
		if (lastBody.length !== 2)
			return done(new Error("Events founded : "+lastBody.length+"\n"+JSON.stringify(lastBody)));
		done();
	});

	it("Guest can't delete Events",function(done){
		request(app)
			.delete('/event/Fake Position')
			.expect(401,done);
	});

	it("User can delete Events",function(done){
		agent
			.delete('/event/Fake Position')
			.expect(200,done);
	});

	it("Get events length must be 1", function(done) {
		request(app)
			.get('/event')
			.expect(function(res){
				if (res.body.length !== 1)
					return done(true);
				done();
			})
			.end();
	});

});

describe("Single event",function(){

	before(function(done){
		//Delete Events Collection
		Event.collection.remove(function(){
			//Insert Event
			var ev = new Event({ name: 'Fake Position',
					type: '1',
					position:
					{ 
						latlng: ['39.956983','8.670916']
					},
					image: 'none',
					data:  new Date() 
				});
			ev.insert().then(function(err){
				done();
			});
		});
	});

	it("Get event 'Fake Position' status code 200 ", function(done) {
		lastHeaders=null;
		lastBody=null;
		request(app)
			.get('/event/Fake Position')
			.expect(function(res){
				lastHeaders = res.headers;
				lastBody = res.body;
			})
			.expect(200,done)
	});

	it("Get event 'Fake Position' content-type json ", function(done) {
		if (typeof lastHeaders["content-type"] !== "string")
			return done(true);
		if (!lastHeaders["content-type"].match(/json/i))
			return done(true);
		done();
	});

	it("Get event 'Fake Position' position.longname contain 'solarussa'", function(done) {
		if (!lastBody.position || !lastBody.position.name || !lastBody.position.longname)
			return done(new Error("Missing position data "+JSON.stringify(lastBody)));
		if (!lastBody.position.longname.match(/solarussa/i))
			return done(new Error('Position is '+lastBody.position.name ));
		done();
	});

});