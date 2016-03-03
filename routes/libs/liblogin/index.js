// login level control 
//
// @ author becxer parrotJ
// @ e-mail becxer87@gmail.com
//
var fs = require('fs');
var loginfile = './secret/login.sec';

module.exports = {
    encrypt : function(passswd){
        
    },
    
    valid : function(id, passwd){

    },
    
    add : function(id, passwd){
        var list = fs.readFileSync(loginfile, 'utf8');
        var ins = id + " " + passwd + " 0";
        console.log(list);
        if( list.indexOf(id) == -1 ){
            fs.appendFileSync(loginfile,ins + "\n");
            console.log("add : "+id);        
        }
    },

    check : function(id, method, redirect){
        var list = fs.readFileSync(loginfile, 'utf8');
        var chk = id + " " + passwd + " 1";
        if( list.indexOf(chk) != -1 ){ 
            console.log("valid");
            method();
        }else{
            console.log("refused");
            redirect();
        }
    }
}
