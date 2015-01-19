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
router.get('/:dir/', function(req, res){
    var mdpath = abpath + "/"+ req.params.dir;
    var projects = fs.readdirSync(mdpath);
    var mds= [];
    var mdsname= [];

    for (i in projects){
    var filename = projects[i];
    
    var stat = fs.statSync(mdpath + '/' + filename);
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

    console.log(fs.exists(mdpath));
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

module.exports = router;
