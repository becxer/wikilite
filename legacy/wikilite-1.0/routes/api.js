//
// usage : rest api for wikilite
// author : becxer, parrotJ
// email : whitewest87@gmail.com
//
var express = require('express');
var router = express.Router();

//CONTROLL MODULES
var ctlpath = '../ctrls/';
var cfobj = require(ctlpath + 'cfctrl.js');

console.log("cfobj : " + JSON.stringify(cfobj.getAll())); 




/*


//CONSTANTS
var mdroot = './mdroot';
var ctrls_path = '../ctrls';

//REQUIRES
var express = require('express');
var fs = require('fs');
var marked = require('marked');
var router = express.Router();


//MD FILE CONTROLL MODULE
var mdctrl = require(ctrls_path+'/mdctrl.js');
mdctrl.init(mdroot);


//SESSTION CONTROLL MODULE
var snctrl = require(ctrls_path+'/snctrl.js');

//GLOBAL VARIABLES
var dirs = mdctrl.find_dirs(mdroot);

//Classes
var md = {
	'name':'title name',
	'content':'html content',
	'path':'real file path', 
	'mtime':'filesystem-time',
	'urlpath' : 'url path'
};

var dir = {
	'name' : 'title name',
	'path' : 'real file path',
	'mtime' : 'filesystem-time',
	'urlpath' : 'url path'
};

function render(res, ejs_name, data_obj){
	var default_obj = {'dirs':dirs };
	for(i in data_obj){
		default_obj[i] = data_obj[i];
	}

	res.render(ejs_name,default_obj);
};

function sessChk(req,res,func){
	snctrl.chk(req.session.user_id, func, function(){
    res.redirect('/');
    });
}

router.get('/add', function(req,res){

	var path = req.query.path;
	var category_path = decodeURI(mdroot+'/'+path.split('/')[2]);
	var data_obj = 
	{	
		'title':'글작성하기',
		'category': path.split('/')[2],
		'name':'',
		'mds':{content:''},
		'filters':mdctrl.find_dirs(category_path),
		'path':path
	}
	render(res,'editor',data_obj);
});

router.get('/edit', function(req,res){

	var path = req.query.path;
	var category_path = decodeURI(mdroot+'/'+
									(path.indexOf('/') == 1) ? path.split('/')[1]:path.split('/')[2]);
	var path_list = path.split('/');
	var data_obj = 
	{	
		'title':'글수정하기',
		'category':path.split('/')[2],
		'name': path_list[path_list.length-1].split('.')[0],
		'mds':mdctrl.read_md_pure(path)[0],
		'filters':mdctrl.find_dirs(category_path),
		'path':path
	}

	render(res,'editor', data_obj);	      
});

router.post('/save', function(req,res){
   
   var path = req.query.path;
   var content = req.body.content;
   console.log(path);
   if(!mdctrl.md_exist(path)){
   		// add
   		path = path+"/"+req.body.name+".md";
   }
   md = mdctrl.update_md(path,content)[0];
   console.log(md);
   res.redirect((md.name == 'FrontPage') ? '/': encodeURI(md.urlpath));
});

router.get('/del',function(req,res){
	var path = req.query.path;
	var repath = path.substring(9,path.lastIndexOf('/'));

	mdctrl.remove_md(path);

	res.redirect('/'+repath);
});

*/

module.exports = router;
