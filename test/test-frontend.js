var assert = chai.assert;
var expect = chai.expect;

describe("Services",function(){
	describe("Language",function(){

		beforeEach(function(){
			//Force language to English
			module(function($provide){
				$provide.value("$window",{
					navigator : {
						languages : ["en"]
					}
				})
			});
			//Inject the httpBackend
			module("NodeAmm");
			inject(function ($injector) {
				$httpBackend = $injector.get("$httpBackend");
			});
			$httpBackend.expectGET("assets/lang/list.json")
				.respond(200,{
					"it" : ["it-*"],
					"en" : ["en-*"],
					"default" : "en"
				});
			$httpBackend.expectGET("assets/lang/en.json")
				.respond(200);
		})

		it("Should request list of langs, and after that should request the english language",inject(function(Language){
			$httpBackend.flush();

		}));

		it("Should request the italian languange when changing the language to it",inject(function(Language){
			$httpBackend.flush();
			$httpBackend.expectGET("assets/lang/it.json")
				.respond(200);
			Language.change("it");
			$httpBackend.flush();
		}));
	});

	describe('User', function () {

		beforeEach(function(){
			//Inject the httpBackend
			module("NodeAmm");
			inject(function ($injector) {
				$httpBackend = $injector.get("$httpBackend");
			});
		})

		it("Should User.logged be false if the user isn't logged",inject(function(User){
			$httpBackend.expectGET("/user/current")
				.respond(401);
			$httpBackend.flush();
			expect(User.logged).to.is.equal(false);
		}));

		it("Should User.logged be true if the user is logged",inject(function(User){
			$httpBackend.expectGET("/user/current")
				.respond(200);
			$httpBackend.flush();
			expect(User.logged).to.is.equal(true);
		}));

		it("Should User broadcast 'user:updated' when logged change",function(done){
			this.timeout(100);
			inject(function(User,$rootScope){
				$httpBackend.expectGET("/user/current")
					.respond(401);
				$httpBackend.flush();
				$rootScope.$on("user:updated",function(){
					done();
				});
				User.setLogged(true);
			})
		});
	});
});