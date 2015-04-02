//CONSTANTS
var proj_path = './projects';
var dmod_path = '../dev_modules';


//REQUIRES
var express = require('express');
var fs = require('fs');
var marked = require('marked');
var router = express.Router();


//MD FILE CONTROLL MODULE
var mdctrl = require(dmod_path+'/mdctrl.js');
mdctrl.init(proj_path);


//SESSTION CONTROLL MODULE
var snctrl = require(dmod_path+'/snctrl.js');


//GLOBAL VARIABLES
var dirs = mdctrl.find_dirs(proj_path);

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

/* Get add Page */
router.get('/add', function(req,res){

	var path = req.query.path;
	var category_path = decodeURI(proj_path+'/'+path.split('/')[2]);
	var title = path.split('/')[2];
	var data_obj = 
	{	
		'title':title,
		'name':'',
		'mds':'',
		'filters':mdctrl.find_dirs(category_path),
		'path':path
	}
	render(res,'editor',data_obj);

    
});

/* Get Edit Page */
router.get('/edit', function(req,res){

	var path = req.query.path;
	var category_path = decodeURI(proj_path+'/'+path.split('/')[2]);
	var mds = mdctrl.read_md_pure(path);
	var title = path.split('/')[2];
	var path_list = path.split('/');
	var data_obj = 
	{	
		'title':title,
		'name': path_list[path_list.length-1].split('.')[0],
		'mds':mds[0],
		'filters':mdctrl.find_dirs(category_path),
		'path':path
	}
	render(res,'editor', data_obj);	      
});

/* Post Save Page */
router.post('/save', function(req,res){
   var path = req.query.path;
   var content = req.body.content;
   if(!mdctrl.md_exist(path)){
   		// add
   		path = path+"/"+req.body.name+".md";
   }
   md = mdctrl.update_md(path,content)[0];
   res.redirect((md.name == 'FrontPage') ? '/': encodeURI(md.urlpath));
});


module.exports = router;
