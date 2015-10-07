angular.module("NodeAmm")
	.factory('Language',function LanguageFactory($http,$window){
		var LangStrings = {},
			Watching = [];
		function changeLanguage(lang) {
			console.log(lang);
			//Load language strings
			$http.get('assets/lang/'+lang+'.json').then(function(result){
				//Set the language data
				LangStrings = result.data;
				//Notify to watchers
				for (var i=0,l=Watching.length;i<l;i++)
					Watching[i](LangStrings,lang);
			},function(){
				console.error("Can't load language "+lang);
			});
		}
		//Add a new function that watch changes to the language
		function watchLanguage(callback) {
			if (typeof callback === "function")
				Watching.push(callback);
		}
		//Obtain Language
		(function obtainLanguages() {
			//Obtain language list
			$http.get('assets/lang/list.json').then(function(result){
				var list = result.data;
				function preferedLanguage(lang_list) {
					//Construct inverted list
					var inv_list = {};
					for (var i in list) {
						if (i != "default") {
							for (var j=0,l=list[i].length;j<l;j++) {
								var exp = list[i][j].split("-");
								if (typeof inv_list[exp[0]] === "undefined")
									inv_list[exp[0]] = {};
								inv_list[exp[0]][exp[1]] = i;
							}
						}
					}
					//Check for localStorage and cookies
					if (localStorage&&localStorage.getItem("_lang"))
						lang_list.unshift(localStorage.getItem("_lang"));
					for (var i=0,l=lang_list.length;i<l;i++) {
						var ex = lang_list[i].split("-");
						if (typeof inv_list[ex[0]] !== "undefined") {
							if (typeof ex[1] !== "undefined") {
								if (typeof inv_list[ex[0]][ex[1]] !== "undefined")
									return changeLanguage(inv_list[ex[0]][ex[1]]);
							} else {
								if (typeof inv_list[ex[0]]['*'] !== "undefined")
									return changeLanguage(inv_list[ex[0]]['*']);
								return changeLanguage(inv_list[ex[0]][Object.keys(inv_list[ex[0]])]);
							} 
						}
					}
					return changeLanguage(list['default']);
				}
				if (typeof $window.navigator.languages === "object")
					return preferedLanguage($window.navigator.languages);
				return preferedLanguage([(navigator.language || navigator.browserLanguage)]);
			},function(){
				//Error, retry again later
				console.error("Can't get language list, probrably an internet error, retry in 2 seconds");
				setTimeout(obtainLanguages,2000);
			});
		})();
		return {
			strings : LangStrings,
			change  : changeLanguage,
			watch	: watchLanguage
		}
	});