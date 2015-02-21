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

// ROUTERS
/* GET home page. */
router.get('/', function(req, res, next) {
    var mds = mdctrl.read_md(proj_path+'/FrontPage.md');

    
    render(res,'frontpage',{'mds':mds});
});

/* Get Dirs reset */
router.get('/set', function(req,res){
    for(var i=0; i <= dirs.length; i++) dirs.shift();
    insdirs();

    res.redirect('/');
});



/* Get add Page */
router.get('/add', function(req,res){
    var path = req.query.path;
    
    render(res,'add',{'path':path});
});

/* Get Edit Page */
router.get('/edit', function(req,res){
    var path = req.query.path;
    var mds = mdctrl.read_md_pure(path);
    
	render(res,'edit',{'mds':mds[0]});       
});

/* Post Save Page */
router.post('/save', function(req,res){
    //파일 이름 여부를 통해 add, edit을 구별해서 path를 저장
    var path = (req.body.name == undefined) ? req.body.path : req.body.path+"/"+req.body.name+".md";
    var content = req.body.content;

   	md = mdctrl.update_md(path,content)[0];

    res.redirect((md.name == 'FrontPage') ? '/': md.urlpath);
});



/* Get Category Page */
router.get('/:category', function(req,res){
	var path = decodeURI(proj_path+'/'+req.params.category);
    var data_obj = 
    {
	 	'path': path,
	 	'filters': mdctrl.find_dirs(path),
	 	'mds': mdctrl.find_mds(path),
	 	'add' : "<a href=/add?path="+path+">add</a>"
    };
   
    render(res,'index',data_obj);
});

/* Get Filter Page Or Category MD */
router.get('/:category/:filter', function(req,res){
    var path = decodeURI(proj_path+'/'+req.params.category+'/'+req.params.filter);
	var data_obj = 
    {
	 	'path': path,
	 	'filters': [{'name':'back', 'urlpath':'/'+req.params.category}],
	 	'mds': (mdctrl.check_type(path) == 'DIR') ? mdctrl.find_mds(path):mdctrl.read_md(path+'.md'),
	 	'add' : "<a href=/add?path="+path+">add</a>"
    };
    
    render(res,'index',data_obj);
});

/* GET MD in url page */
router.get('/:category/:filter/:md', function(req,res){
    var path = decodeURI(proj_path+req.path+'.md');
    var data_obj = 
	{
	 	'path': path,
	 	'filters': [{'name':'back', 'urlpath':'/'+req.params.category + '/' + req.params.filter}],
	 	'mds': mdctrl.read_md(path),
	 	'add' : ""
    };
    
    render(res,'index',data_obj);   
});


module.exports = router;
