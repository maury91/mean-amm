angular.module("NodeAmm")
	.factory('Positions',function PositionsFactory($resource){
		var positions = [];
		$resource("position").query(function(res){
			//Don't broke the link between the arrays
			for (var i=0,l=res.length;i<l;i++)
				positions.push(res[i]);
		});
		return positions;
	});