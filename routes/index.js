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

// 모듈로 뺼것!!------------------------------------------------------[TODO]

// recursive func: find dir and make object
function intro_search(path) {
    var tempObj = new Object();         //현재 경로에 dir을 담을 임시 객체
    var projects = fs.readdirSync(path);//현재 경로에 포함하는 file list GET(file,dir포함)

    for (var i in projects) {
        var tempPath = path + "/" + projects[i];
        var stat = fs.statSync(tempPath);
        if (stat.isFile()) continue;    //현재 확인하는 file이 isNotDir이면 continue

        console.log("READ: "+projects[i]);
                                        //현재 확인하는 Dir명을 Key로 하도록 recursive func call
        tempObj[projects[i]] = intro_search(tempPath);
    }
    return tempObj;     //완료된 임시 object 리턴
}

//rootobj는 projects객체 라고 생각하면 됨
var rootobj = intro_search(abpath);    //json 방식으로 해당 URL 안에 들어있는 폴더를 서치intro_search(abpath);
console.log(rootobj);

//------------------------------------------------------------------------------

function init(res) {
	res.cookie('tree', JSON.stringify(rootobj));
}

/* GET home page. */
router.get('/', function(req, res, next) {
	init(res);
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
	init(res);
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
router.get('/:dir/*', function(req,res){
    //decodeURI를 이용해서 한글 디코딩
    var mdpath = decodeURI(abpath + req.path + ".md");                         //md파일 경로 저장
    var filename = decodeURI(req.path.substring(req.path.lastIndexOf('/')+1)); //md파일 이름 잘라내기

    console.log(mdpath);
    var mds = [];
    var mdsname= [];

    console.log(fs.existsSync(mdpath));
    if(fs.existsSync(mdpath)){    //해당하는 md파일이 존재하는지 확인
        var content = fs.readFileSync(mdpath,'utf-8');
        var html = markdown.toHTML(content);

        mds.push(html);
        mdsname.push(filename);    
    }

    res.render('index',{'dirs':dirs, 'mds':mds, 'mdname':mdsname});        
});


/* GET README.md url page */
router.get('//README',function(req,res){

    // 메인페이지 README url 연결시 main으로 리다이렉트
    res.redirect('/');
});


module.exports = router;
