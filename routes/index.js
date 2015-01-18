var express = require('express');
var fs = require('fs');
var markdown = require('markdown').markdown;
var path = './projects';
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	var projects = fs.readdirSync(path);
    console.log(projects);
    var dirs =[];
    var mds = []; 
    for (i in projects){
        var filename = projects[i];
        var stat = fs.statSync(path + '/' + filename);
     
        if (stat.isDirectory()) {
            dirs.push(filename);
        }else{
			var content = fs.readFileSync(path+'/'+filename,'utf-8');
			var html = markdown.toHTML(content);
            mds.push(html);
        }   
        //res.send(i);
    }
	res.render('index',{'dirs':dirs, 'mds':mds});
});

module.exports = router;
