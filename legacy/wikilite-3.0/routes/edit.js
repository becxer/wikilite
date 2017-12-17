// edit router for wikilite
//
// @ author becxer parrotJ
// @ e-mail becxer87@gmail.com

var router = require('express').Router();
var pre = require('./preload.js');
var mdctrl = pre.mdctrl();
var snctrl = pre.snctrl();

console.log("now loading edit router");

function sessCheck(req, res, func){
    if(typeof req.session.user_id == 'undefined' || req.session.user_id == null){
        res.redirect('/'); return;
    }
    snctrl.check_valid(req.session.user_id, req.session.user_passwd,
                 func, function(){ res.redirect('/');});
}

router.post('/login', function(req, res){
    var user_id = req.body.user_id;
    var user_passwd = req.body.user_passwd;
    res = snctrl.check_valid_sync(user_id, user_passwd)
    console.log(res);
})

router.get('/add', function(req,res){
    var path = req.query.path;
    var category = decodeURI(path.split('/')[0]);
    var data_obj = 
    {
        'pgtitle': pre.add_title,
        'pgbook': category,
        'pgchapters':mdctrl.find_dirs(category),
        'pages':{
            'type':'md',
            'title':'',
            'content':''
         },
        'path':path
    }
    pre.render(res,'editor',data_obj);
});

router.get('/edit', function(req,res){
    var oripath = req.query.path;
    var path = oripath.substring(0,oripath.lastIndexOf('/'));
    var category = decodeURI(path.split('/')[0]);
    var data_obj = 
    {    
        'pgtitle':pre.edit_title,
        'pgbook':category,
        'pgchapters':mdctrl.find_dirs(category),
        'pages':mdctrl.read_md_pure(oripath),
        'path':path
    }
    pre.render(res,'editor', data_obj);          
});

router.post('/save', function(req,res){
   var path = req.query.path;
   var title = req.body.title;
   var content = req.body.content;
   md = mdctrl.update_md(path+'/'+title,content);
   res.redirect((md.title == 'FrontPage') ? '/': encodeURI('/'+md.path));
});

router.get('/del',function(req,res){
    var path = req.query.path;
    var repath = path.substring(0,path.lastIndexOf('/'));
    mdctrl.remove_md(path);
    res.redirect('/'+repath);
});

module.exports = router;