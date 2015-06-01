
var fs = require('fs');

//load wikilite.conf
console.log("loading wikilite.conf");
conf_obj = {};

cf_str = fs.readFileSync('conf/wikilite.conf','utf-8').split('\n');
console.log(cf_str);
for(i in cf_str){
	var oneline = cf_str[i].trim();	
	if(oneline.length > 0 && oneline[0] != '#'){
		var key = oneline.split(' ')[0];
		var value = oneline.split(' ')[1];
		conf_obj[key] = value;
	}
}

var setConfs_ = function (){
	for (key in conf_obj){
		console.log(key);
		//페북 키값을 설정한 값으로 교체시킨다..
	}
}

module.exports = {
	getAll : function(){
		return conf_obj;
	},	
	getValue : function(key){
		return conf_obj[key];
	},
	setConfs : setConfs_
};

setConfs_()
