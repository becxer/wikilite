// Released under LGPL license
// Copyright (c) 2014- Becxer 
// Copyright (c) 2015- ParrotJ

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

//Functions
function render(res, ejs_name, data_obj){
	var default_obj = {'dirs':dirs };
	for(i in data_obj){
		default_obj[i] = data_obj[i];
	}
	res.render(ejs_name,default_obj);
};


// ROUTERS

/* Get Dirs reset */
router.get('/setting', function(req,res){

	var data_obj = 
	{
		'title': '설정하기',
		'category': '',
 		'filters': []
   	};

	render(res, 'setting',data_obj);
});


/* Get Dirs reset */
router.get('/reset', function(req,res){
    for(var i=0; i <= dirs.length; i++) dirs.shift();
	dirs = mdctrl.find_dirs(proj_path);

    res.redirect('/');
});

/* Post FB Login */
router.post('/fb', function(req,res){
	snctrl.add(req.body.user_id);
	req.session.user_id = req.body.user_id;
    res.redirect('/');
});

/* GET home page. */
router.get('/', function(req, res, next) {

    var data_obj = 
	{
		'title': '위키라이트',
		'category':'',
 		'filters': [],
 		'mds': mdctrl.read_md(proj_path+'/FrontPage.md')
   	};
    
    render(res,'front',data_obj);
});

/* Get Category Page */
router.get('/:category', function(req,res){

	var path = decodeURI(proj_path+'/'+req.params.category);
    var data_obj = 
	{
		'title': req.params.category,
		'category' : req.params.category,
 		'filters': mdctrl.find_dirs(path),
 		'mds': mdctrl.find_mds(path),
 		'path': path
   	};
    
    render(res,'index',data_obj);
    
});

/* Get Filter Page Or Category MD */
router.get('/:category/:filter', function(req,res){
    var path = decodeURI(proj_path+'/'+req.params.category+'/'+req.params.filter);
	var data_obj = 
    {
    	'title': req.params.filter,
		'category' : req.params.category,
	 	'filters': mdctrl.find_dirs(decodeURI(proj_path+'/'+req.params.category)),
	 	'mds': (mdctrl.check_type(path) == 'DIR') ? mdctrl.find_mds(path):mdctrl.read_md(path+'.md'),
	 	'path': path
    };
    
    render(res,'index',data_obj);
});

/* GET MD in url page */
router.get('/:category/:filter/:md', function(req,res){
    var path = decodeURI(proj_path+req.path+'.md');
    var data_obj = 
	{
		'title': req.params.filter,
		'category' : req.params.category,
	 	'filters': [{'name':'back', 'urlpath':'/'+req.params.category + '/' + req.params.filter}],
	 	'mds': mdctrl.read_md(path),
	 	'path': path
    };
    
    render(res,'index',data_obj);   
});


module.exports = router;
