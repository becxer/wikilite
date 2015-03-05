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

	sessChk(req,res,function(){	
		var path = req.query.path;

    	render(res,'add',{'path':path});
    });
    
});

/* Get Edit Page */
router.get('/edit', function(req,res){

	sessChk(req,res,function(){	
		var path = req.query.path;
   		var mds = mdctrl.read_md_pure(path);
    
		render(res,'edit',{'mds':mds[0]});
    });
	      
});

/* Post Save Page */
router.post('/save', function(req,res){

	sessChk(req,res,function(){	
	    //파일 이름 여부를 통해 add, edit을 구별해서 path를 저장
		var path = (req.body.name == undefined) ? req.body.path : req.body.path+"/"+req.body.name+".md";
	    	var content = req.body.content;
	
		md = mdctrl.update_md(path,content)[0];

		res.redirect((md.name == 'FrontPage') ? '/': encodeURI(md.urlpath));
    });

});


module.exports = router;
