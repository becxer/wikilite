var express = require('express');
var fs = require('fs');
var markdown = require('markdown').markdown;
var router = express.Router();
var abpath = './projects';


/* READ dir list */
var dirs =[];
var projects = fs.readdirSync(abpath);

for (i in projects){
    var filename = projects[i];
    var stat = fs.statSync(abpath + '/' + filename);
     
    if (stat.isDirectory()) {
            dirs.push(filename);
    }
}


/* GET home page. */
router.get('/', function(req, res, next) {
    var mds = [];
    var mdsname =[];
    var links = [];

    mdsname.push("README")
    var content = fs.readFileSync('./README.md','utf-8');
    var html = markdown.toHTML(content);
    mds.push(html);
    
	res.render('index',{'dirs':dirs, 'mds':mds, 'mdname':mdsname});
});

/* GET tab page. */
router.get('/:dir', function(req, res){
    var mdpath = abpath + "/"+ req.params.dir;
    var projects = fs.readdirSync(mdpath);
    var mds= [];
    var mdsname= [];

    //파일 목록을 읽어들임
    for (i in projects){
    var filename = projects[i];
    var stat = fs.statSync(mdpath + '/' + filename);

    //확장자가 md인 파일만 읽도록 확장자를 자른후 확인
    var ext = filename.substring(filename.lastIndexOf(".") + 1);
        if (stat.isFile() && ext == 'md') {
            var content = fs.readFileSync(mdpath + '/' + filename,'utf-8');
            var html = markdown.toHTML(content);
            mds.push(html);
            mdsname.push(filename.split(".", 1));
        }
    }

    res.render('index',{'dirs':dirs, 'mds':mds, 'mdname':mdsname});
});

/* GET MD in url page */
router.get('/:dir/:md', function(req,res){
    var dirname = req.params.dir;
    var mdname = req.params.md;
    var mdpath = abpath + "/"+ dirname + "/" + mdname + ".md";
    var mds = [];
    var mdsname= [];

    //올바른 상위 디렉토리 명인지 파일이 존재하는지 확인
    if(dirs.indexOf(dirname) != -1 && fs.existsSync(mdpath)){
        var content = fs.readFileSync(mdpath,'utf-8');
        var html = markdown.toHTML(content);
        mds.push(html);
        mdsname.push(mdname);
        res.render('index',{'dirs':dirs, 'mds':mds, 'mdname':mdsname});

    }
    else
        res.render('index',{'dirs':dirs, 'mds':mds, 'mdname':""});           
    
});

/* GET README.md url page */
router.get('//README',function(req,res){
    res.redirect('/');
});
// 메인페이지 README url 연결시 main으로 리다이렉트

module.exports = router;
