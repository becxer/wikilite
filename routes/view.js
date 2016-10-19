// view router for wikilite 
//
// @ author becxer parrotJ
// @ e-mail becxer87@gmail.com

//CONSTANTS
var router = require('express').Router();
var pre = require('./preload.js');
var mdctrl = pre.mdctrl();

console.log("now loading view router");

/* GET front page. */
router.get('/', function(req, res, next) {
    var pages = [mdctrl.read_md(pre.front_page)];
    var data_obj = 
    {
        'pgtitle': pre.title,
        'pgbook':'',
        'pgchapters': [],
        'pages': pages,
        'path' : '',
        'addable' : false
    };
    pre.render(res,'viewer',data_obj);
});

/* Get Book */
router.get('/:book', function(req,res){
    var path_book = decodeURI(req.params.book);
    var sort_by = req.query.sort_by;
    var size = req.query.size;
    var start = req.query.start;
    var end = req.query.end;
    
    var addable = true;
    var pages = mdctrl.find_mds(path_book, sort_by, size, start, end);
    if (pages.length == 1 && pages[0].title == req.params.book){ addable = false; }
    var data_obj = 
    {
        'pgtitle': req.params.book,
        'pgbook' : path_book,
        'pgchapters': mdctrl.find_dirs(path_book),
        'pages': pages,
        'path': path_book,
        'addable' : addable
    };
    
    pre.render(res,'viewer',data_obj);
});

/* Get Chapter */
router.get('/:book/:chapter', function(req,res){
    var path_chapter = decodeURI(req.params.book+'/'+req.params.chapter);
    var path_book = decodeURI(req.params.book);
    var sort_by = req.query.sort_by;
    var size = req.query.size;
    var start = req.query.start;
    var end = req.query.end;

    var addable = true;
    var pages = mdctrl.find_mds(path_chapter, sort_by, size, start, end);
    if (pages.length == 1 && pages[0].title == req.params.chapter){ addable = false; }
    var data_obj = 
    {
        'pgtitle': req.params.chapter,
        'pgbook' : path_book,
        'pgchapters': mdctrl.find_dirs(path_book),
        'pages' : pages,
        'path': path_chapter,
        'addable' : addable
    };
    pre.render(res,'viewer',data_obj);
});

/* GET Page */
router.get('/:book/:chapter/:page', function(req,res){
    var path_page = decodeURI(req.params.book + '/' + req.params.chapter + '/' + req.params.page);
    var path_chapter = decodeURI(req.params.book+'/'+req.params.chapter);
    var path_book = decodeURI(req.params.book);
    var data_obj = 
    {
        'pgtitle': req.params.page,
        'pgbook' : path_book,
        'pgchapters': mdctrl.find_dirs(path_book),
        'pages': [mdctrl.read_md(path_page)],
        'path': path_page,
        'addable' : false
    }; 
    pre.render(res,'viewer',data_obj);   
});

module.exports = router;

