// facebook session level control 
//
// @ author becxer parrotJ
// @ e-mail becxer87@gmail.com
//
var fs = require('fs');
var keypth = './secret/fbkeys';

module.exports = {
	
	add : function(key){
		var list = fs.readFileSync(keypth, 'utf8');
		var ins = key + " 0";
		console.log(list);
		if( list.indexOf(key) == -1 ){
			fs.appendFileSync(keypth,ins + "\n");
			console.log("add : "+key);		
		}
	},

	check : function(key, method, redirect){
		console.log("check : "+key);
		var list = fs.readFileSync(keypth, 'utf8');
		var chk = key + " 1";
		if( list.indexOf(chk) != -1 ){ 
			console.log("valid");
			method();
		}else{
			console.log("refused");
			redirect();
		}
	}
}
