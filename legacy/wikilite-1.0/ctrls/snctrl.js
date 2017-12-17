// Released under LGPL license
// Copyright (c) 2015- ParrotJ

var fs = require('fs');
var keypth = './keys'
var redfunc = "";

module.exports = {
	
	
	init : function(func){
	redfunc	= func;
	},
	
	add : function(key){
		
		var list = fs.readFileSync(keypth, 'utf8');
		var ins = key+" 0\n";
		
		console.log(list);
		if( list.indexOf(key) == -1 ){
			fs.appendFileSync(keypth,ins);
			console.log("add : "+key);		
		}

	},

	chk : function(key, method, redirect){
		console.log("chk : "+key);
		
		var list = fs.readFileSync(keypth, 'utf8');
		var chk = key + " 1";

		if( list.indexOf(chk) != -1 ) 
			method();
		else 
			redirect();
	}

}
