// view router for wikilite
//
// @ author becxer parrotJ
// @ e-mail becxer87@gmail.com

console.log("now loading preload router");

pre_obj = {
    front_title : '',
    add_title : '글작성하기',
    edit_title : '글수정하기',
    front_page : 'FrontPage',
    mdroot : './',
    mdtrash : './',
    libpath : './libs',
    mdctrl : function(){ 
                var ctrl = require(this.libpath+'/libmd');
                ctrl.init(this.mdroot,this.mdtrash);
                return ctrl;
            },
    snctrl : function(){
                var ctrl = require(this.libpath+'/libfbsession');
                return ctrl;
            },
    render : function (res, ejs_name, data_obj){
                this.mdctrl().init(this.mdroot,this.mdtrash);
                var books = this.mdctrl().find_dirs("/");
                var default_obj = {'books':books};
                for(i in data_obj){
                    default_obj[i] = data_obj[i];
                }
                res.render(ejs_name,default_obj);
            }
}

var conf = require(pre_obj.libpath+'/libconf');
pre_obj['front_title'] = conf.getValue('TITLE');
pre_obj['mdroot'] += conf.getValue('MD_ROOT');
pre_obj['mdtrash'] += conf.getValue('MD_TRASH');

module.exports = pre_obj;
