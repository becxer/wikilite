// view router for wikilite 
//
// @ author becxer parrotJ
// @ e-mail becxer87@gmail.com

//CONSTANTS
var router = require('express').Router();
var pre = require('./preload.js');
var mdctrl = pre.mdctrl();

/* GET front page. */
router.get('/', function(req, res, next) {
	var mds = [mdctrl.read_md(pre.front_page)];
    var data_obj = 
	{
		'pgtitle': pre.front_title,
		'pgcategory':'',
 		'pgfilters': [],
 		'mds': mds
   	};
    pre.render(res,'front',data_obj);
});

/* Get Category Page */
router.get('/:category', function(req,res){
	var path = decodeURI(req.params.category);
    var data_obj = 
	{
		'pgtitle': path,
		'pgcategory' : path,
 		'pgfilters': mdctrl.find_dirs(path),
 		'mds': mdctrl.find_mds(path),
 		'path': path
   	};
    pre.render(res,'index',data_obj);
});

/* Get Filter Page or MD */
router.get('/:category/:filter', function(req,res){
    var path_filter = decodeURI(req.params.category+'/'+req.params.filter);
	var path_category = decodeURI(req.params.category);
	var data_obj = 
    {
    	'pgtitle': req.params.filter,
		'pgcategory' : req.params.category,
	 	'pgfilters': mdctrl.find_dirs(path_category),
	 	'mds' : mdctrl.find_mds(path_filter),
	 	'path': path_filter
    };
    pre.render(res,'index',data_obj);
});

/* GET MD Page */
router.get('/:category/:filter/:md', function(req,res){
    var path_md = decodeURI(req.params.category + '/' + req.params.filter + '/' + req.params.md);
    var path_filter = decodeURI(req.params.category+'/'+req.params.filter);
	var path_category = decodeURI(req.params.category);
    var data_obj = 
	{
		'pgtitle': req.params.md,
		'pgcategory' : req.params.category,
	 	'pgfilters': mdctrl.find_dirs(path_category),
	 	'mds': [mdctrl.read_md(path_md)],
	 	'path': path_filter
    }; 
    pre.render(res,'index',data_obj);   
});

module.exports = router;
