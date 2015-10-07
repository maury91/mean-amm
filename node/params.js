//Obtain params (i know it's a bit massive for just the debug option)
var params = {},
	_params = process.argv
				//Search only params that starts with --
				.filter(function(a){ return a.slice(0,2) == '--'})
				//Transform from --NODE_ENV=test to ['NODE_ENV','test']
				.map(function(a){ var b = a.match(/\-\-([^=]*)=?(.*)/); if (b !== null) b = b.slice(1); return b });
for (var i in _params)
	params[_params[i][0]] = _params[i][1];

module.exports = params;