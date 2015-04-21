
var fs = require('fs');

//load wikilite.conf
conf_obj = {};
cf_str = fs.readFileSync('conf/wikilite.conf','utf-8').split('\n');
for(i in cf_str){
	var oneline = cf_str[i].trim();	
	if(oneline.length > 0 && oneline[0] != '#'){
		var key = oneline.split(' ')[0];
		var value = oneline.split(' ')[1];
		conf_obj[key] = value;
	}
}

module.exports = {
	getAll : function(){
		return conf_obj;
	}
	,	
	getValue : function(key){
		return conf_obj[key];
	}
};

