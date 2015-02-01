var express = require('express');
var fs = require('fs');
var markdown = require('markdown').markdown;
var router = express.Router();
var abpath = './projects';

/* READ dir list */
var dirs =[];

function insdirs(){
    var projects = fs.readdirSync(abpath);

    for (i in projects){
        var filename = projects[i];
        var stat = fs.statSync(abpath + '/' + filename);
         
        if (stat.isDirectory()) {
                if(filename != ".git"); dirs.push(filename);
        }
    }
}

insdirs();

// 모듈로 뺼것!!------------------------------------------------------[TODO]

// recursive func: find dir and make object
function intro_search(path) {
    var tempObj = new Object();         //현재 경로에 dir을 담을 임시 객체
    var projects = fs.readdirSync(path);//현재 경로에 포함하는 file list GET(file,dir포함)

    for (i in projects) {
        var tempPath = path + "/" + projects[i];
        var stat = fs.statSync(tempPath);

        if (stat.isFile()) continue;    //현재 확인하는 file이 isNotDir이면 continue

                                        //현재 확인하는 Dir명을 Key로 하도록 recursive func call
        tempObj[projects[i]] = intro_search(tempPath);
        
    }
    return tempObj;     //완료된 임시 object 리턴
}


//------------------------------------------------------------------------------

function insList(List,object,pathArr,order){    //객체를 통해서 같은 레벨 단위로 디렉토리명 리스트를 만드는 함수
        List.push(Object.keys(object));         //현재 레벨의 객체들의 디렉토리명을 리스트에 푸쉬
        
            for(i in object){
                if(escape(i) == escape(pathArr[order]) &&
                    order <= pathArr.length)    //url을 통해서 다음 디렉토리를 찾아낸 이후 그 내부 객체를 찾아 들어감
                    insList(List,object[i],pathArr,order+1);
            }
    }

//------------------------------------------------------------------------------

function init(req,list) {
    var rootobj = intro_search(abpath);     //json 방식으로 해당 URL 안에 들어있는 폴더를 서치intro_search(abpath);

    var pathArr = decodeURIComponent(req.path).split('/');
    pathArr.shift();

    var dirlist = [];
    insList(dirlist,rootobj,pathArr,0);

    list.push(pathArr,dirlist);
}

//------------------------------------------------------------------------------

/* GET home page. */
router.get('/', function(req, res, next) {
    var mds = [];
    var mdsname =[];
    var links = [];

    mdsname.push("README")
    var content = fs.readFileSync('./README.md','utf-8');
    var html = markdown.toHTML(content);
    mds.push(html);
    
	res.render('index',{'dirs':dirs, 'mds':mds, 'mdname':mdsname, 'dirList':""});
});

/* GET README.md url page */
router.get('//README',function(req,res){
    
    // 메인페이지 README url 연결시 main으로 리다이렉트
    res.redirect('/');
});

/* Get Dirs reset */
router.get('/set', function(req,res){
    for(var i=0; i <= dirs.length; i++)
        dirs.shift();
    insdirs();

    res.redirect('/');
});

/* GET MD in url page && Directory View page */
router.get('/*', function(req,res){
    var path = decodeURI(abpath + req.path);    //한글 디코딩
    var filename = decodeURI(req.path.substring(req.path.lastIndexOf('/')+1)); //md파일 이름 잘라내기

    var mds = [];
    var mdsname= [];
    var dirList = [];

    init(req,dirList);

    if(fs.existsSync(path+".md"))       //해당하는 md파일이 존재하는지 확인
    {
        path += ".md";
        var content = fs.readFileSync(path,'utf-8');
        var html = markdown.toHTML(content);

        mds.push(html);
        mdsname.push(filename);    
    } 
    else if(fs.existsSync(path))         //해당하는 디렉토리가 존재하는지 확인
    {
        var projects = fs.readdirSync(path);

        //파일 목록을 읽어들임
        for (i in projects){
            var filename = projects[i];
            var stat = fs.statSync(path + '/' + filename);

        //확장자가 md인 파일만 읽도록 확장자를 자른후 확인
            var ext = filename.substring(filename.lastIndexOf(".") + 1);
            
            if (stat.isFile() && ext == 'md') {
                var content = fs.readFileSync(path + '/' + filename,'utf-8');
                var html = markdown.toHTML(content);
            
                mds.push(html);
                mdsname.push(filename.split(".", 1));
            }
        }
    }

    res.render('index',{'dirs':dirs, 'mds':mds, 'mdname':mdsname, 'dirList':dirList});        
});



module.exports = router;
