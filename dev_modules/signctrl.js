var fs = require('fs');
var keypth = './keys'

module.exports = {
	add : function(key){
		var ins = key + " 0\n";

		fs.appendFileSync(keypth,key);
	},

	chk : function(key, method){
		console.log("chk : "+key);
		
		var list = fs.readFileSync(keypth, 'utf8');
		var chk = key + "1";

		if( list.indexOf(chk) != -1 ) 
			method();
		
	}

}