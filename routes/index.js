var express = require('express');
var fs = require('fs');
var markdown = require('markdown').markdown;
var abpath = './projects';
var router = express.Router();


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
    var mdsname=[];
    mdsname.push("README.md")
    var content = fs.readFileSync('./README.md','utf-8');
    var html = markdown.toHTML(content);
    mds.push(html);

	res.render('index',{'dirs':dirs, 'mds':mds, 'mdname':mdsname});
});

/* GET Tab page. */
router.get('/:dir', function(req, res){
    var mdpath = abpath + "/"+ req.params.dir;
    var projects = fs.readdirSync(mdpath);
    var mds= [];
    var mdsname= [];

    for (i in projects){
    var filename = projects[i];
    
    var stat = fs.statSync(mdpath + '/' + filename);
     
        if (stat.isFile()) {
            var content = fs.readFileSync(mdpath + '/' + filename,'utf-8');
            var html = markdown.toHTML(content);
            mds.push(html);
            mdsname.push(filename);
        }
    }

    res.render('index',{'dirs':dirs, 'mds':mds, 'mdname':mdsname});
});

module.exports = router;
