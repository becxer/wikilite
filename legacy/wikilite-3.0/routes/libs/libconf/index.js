// lib for wikilite.conf control 
// @ author becxer
// @ e-mail becxer87@gmail.com

var fs = require('fs');

//load wikilite.conf
console.log("loading wikilite.conf");

cf_str = fs.readFileSync('wikilite.conf','utf-8');
conf_obj = JSON.parse(cf_str);

module.exports = {
    getAll : function(){
        return conf_obj;
    },    
    getValue : function(key){
        return conf_obj[key];
    }
};

