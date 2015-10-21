// view router for wikilite
//
// @ author becxer parrotJ
// @ e-mail becxer87@gmail.com

module.exports = {
//TODO replace constant mdroot,mdtrash with libconf
	front_title : '위키라이트',
	add_title : '글작성하기',
	edit_title : '글수정하기',
	front_page : 'FrontPage',
	mdroot : './mdroot',
	mdtrash : './mdtrash',
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
				var categories = this.mdctrl().find_dirs("/");
				var default_obj = {'categories':categories};
				for(i in data_obj){
					default_obj[i] = data_obj[i];
				}
				res.render(ejs_name,default_obj);
			}
}

