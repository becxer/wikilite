var express = require('express');
var fs = require('fs');
var marked = require('marked');
var router = express.Router();
var abpath = './projects';

//------------------------------------------------------------------------------
/* READ dir list */
var dirs =[];

function insdirs(){
    var projects = fs.readdirSync(abpath);

    for (i in projects){
        var filename = projects[i];
        var stat = fs.statSync(abpath + '/' + filename);
            
        if (stat.isDirectory()) {
                if(filename != ".git") dirs.push(filename);
        }
    }
}

insdirs();
//------------------------------------------------------------------------------
function findFile(path, mds, filter) {
    var files = fs.readdirSync(path);

    for(i in files){
        var filename = files[i];
        var file = fs.statSync(path+'/'+filename);
        var ext = filename.substring(filename.lastIndexOf(".")+1);

        if (file.isFile() && ext == 'md')
        {
          var content = marked(fs.readFileSync(path + '/' + filename,'utf-8'));
          mds.push({'name':filename.split(".")[0], 'content':content, 'path':path+'/'+filename, 'mtime':file.mtime});
        } 
        else if(file.isDirectory() && filename != ".git") 
        {
          filter.push({'name':filename,'path':path.substring(10)+'/'+filename});
          findFile(path+'/'+filename, mds, filter);
        }
    }
}
//------------------------------------------------------------------------------


/* GET home page. */
router.get('/', function(req, res, next) {
    var mds = [];
    var content = marked(fs.readFileSync('./projects/FrontPage.md','utf-8'));
    var html = {name:"FrontPage", content:content};

    mds.push(html);
    
	res.render('frontpage',{'dirs':dirs, 'mds':mds});
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
    res.render('add',{'dirs':dirs,'path':path}); 
});

/* Get Edit Page */
router.get('/edit', function(req,res){
    var path = req.query.path;
    var content = fs.readFileSync(path,'utf-8');

    res.render('edit',{'dirs':dirs,'content':content,'path':path});        
});

/* Post Save Page */
router.post('/save', function(req,res){
    //파일 이름 여부를 통해 add, edit을 구별해서 path를 저장
    var path = (req.body.name == undefined) ? req.body.path : req.body.path+"/"+req.body.name+".md";
    var content = req.body.content;

    fs.writeFile(path,content,function(err){
        if(err) throw err;
    });

    var filename = path.substring(path.lastIndexOf('/'));
    path = path.replace(filename,'');                   //파일이름 제거
    path = path.substring(10);                          //./projects 제거

    res.redirect((path == '') ? '/': path);
});



/* Get Category Page */
router.get('/:category', function(req,res){
    var path = decodeURI(abpath+'/'+req.params.category);
    var mds = [];
    var filter = [];
    var add = "<a href=/add?path="+path+">add</a>";
    
    if(req.query.filter == undefined) 
        findFile(path,mds,filter);
    else
    {
        path = decodeURI(abpath+req.query.filter);
        filter = [{'name':'back', 'path':'/'+req.params.category}];

        findFile(path,mds,filter);
    }

    mds.sort(function(a,b){
        return a.mtime > b.mtime ? -1 : a.mtime < b.mtime ? 1 : 0;
    });

    res.render('index',{'dirs':dirs, 'filters':filter, 'add':add, 'mds':mds});
});

/* Get Filter Page */
router.get('/:category/:filter', function(req,res){
    var path = decodeURI(abpath+'/'+req.params.category+'/'+req.params.filter);
    var mds = [];
    var filter = [{'name':'back', 'path':'/'+req.params.category}];
    var add = "<a href=/add?path="+path+">add</a>";
    
    findFile(path,mds,filter);

    mds.sort(function(a,b){
        return a.mtime > b.mtime ? -1 : a.mtime < b.mtime ? 1 : 0;
    });

    res.render('index',{'dirs':dirs, 'filters':filter, 'add':add, 'mds':mds});
});

/* GET MD in url page */
router.get('/*', function(req,res){
    var path = decodeURI(abpath+req.path+'.md');    //한글 디코딩
    var filename = decodeURI(req.path.substring(req.path.lastIndexOf('/')+1)); //md파일 이름 잘라내기
    var mds = [];
    var filter = [];
    var add = "";

    if(fs.existsSync(path))       //해당하는 md파일이 존재하는지 확인
    {
        var file = fs.statSync(path);
        var content = marked(fs.readFileSync(path,'utf-8'));

        mds.push({'name':filename, 'content':content, 'path':path, 'mtime':file.mtime});  
    }

    res.render('index',{'dirs':dirs, 'filters':filter, 'add':add, 'mds':mds });        
});


module.exports = router;
