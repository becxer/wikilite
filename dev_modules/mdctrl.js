var fs = require('fs');
var marked = require('marked');

//Classes
var md = {
	'name':'title name',
	'content':'html content',
	'path':'real file path', 
	'mtime':'filesystem-time',
	'urlpath' : 'url path'
};

var dir = {
	'name' : 'title name',
	'path' : 'real file path',
	'mtime' : 'filesystem-time',
	'urlpath' : 'url path'
};

var cvt_pth2fname = function (path){
	return path.substring(path.lastIndexOf('/')+1,path.lastIndexOf('.'));
};

var cvt_pth2urlpth = function(root,path){
	var ext = path.substring(path.lastIndexOf(".")+1);    
	var res = path.substring(root.length);	
	if(ext == 'md') res = res.substring(0,res.length-3);
	return res;
}

module.exports ={
	
	root : 'root',
	init : function(root){
		this.root = root;
	},
	
	//경로안에 있는 디렉토리 가져오기
	//리턴값 : 해당 경로안에 있는 directory 이름들
	find_dirs : function(abpath){
		var dirs = [];
		var projects = fs.readdirSync(abpath);

		for (i in projects){
			var filename = projects[i];
			var stat = fs.statSync(abpath + '/' + filename);
            
			if (stat.isDirectory() && filename != ".git") {
				var path = ''+abpath+'/'+filename;
				var urlpath = cvt_pth2urlpth(this.root,path);
                dirs.push({'name':filename, 'path':path,'urlpath' :urlpath ,'mtime':stat.mtime});
			}
		}
		return dirs;	
	},

	//경로안에 있는 모든 md 파일 가져오기
	//리턴값 : 해당 경로안에 있는 모든 md 파일들
	find_mds : function(abpath){
		var mds = [];
		var files = fs.readdirSync(abpath);
		for(i in files){
			var filename = files[i];
			var stat = fs.statSync(abpath + '/' + filename);
			var ext = filename.substring(filename.lastIndexOf(".")+1);
			if ( stat.isDirectory() && filename != ".git" ) {
				mds = mds.concat(this.find_mds(abpath + '/' +filename));
			}else if(stat.isFile() && ext == 'md'){
				var content = marked(fs.readFileSync(abpath + '/' + filename,'utf-8'));
				var path = ''+abpath+'/'+filename;
				var urlpath = cvt_pth2urlpth(this.root,path);
   		        mds.push({'name':filename.split(".")[0], 'content':content, 'path':path, 'urlpath' : urlpath, 'mtime':stat.mtime});
			}
		}
		mds.sort(function(a,b){
        	return a.mtime > b.mtime ? -1 : a.mtime < b.mtime ? 1 : 0;
    	});
		return mds;
	},

	add_dir : function(abpath, dir_name){
		
	},

	remove_dir : function(abpath, dir_name){
		
	},
	
	md_exist : function(path){
		return fs.existsSync(path) && (path.split('.')[2] == 'md');
	},
	
	read_md : function(path){
		var mds = [];
		var filename = cvt_pth2fname(path);
    	var content = marked(fs.readFileSync(path,'utf-8'));
  		var md = {name:filename, content:content, path:path , urlpath: cvt_pth2urlpth(this.root,path)};
  		mds.push(md);
	    return mds;
	},
	
	read_md_pure : function(path){
		var mds = [];
		var filename = cvt_pth2fname(path);
    	var content =fs.readFileSync(path,'utf-8');
  		var md = {name:filename, content:content, path:path, urlpath: cvt_pth2urlpth(this.root,path)};
  		mds.push(md);
	    return mds;
	},

	update_md : function(path, md_content){
		fs.writeFile(path,md_content,function(err){
        	if(err) throw err;
        }); 
        return this.read_md(path);
	},

	remove_md : function(path, md_filename){ 
		
	},
	
	check_type : function(path){
		if (fs.existsSync(path)) return "DIR";
		else if (fs.existsSync(path+'.md')) return "FILE";
	}
};
