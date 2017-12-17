// lib for md file control
//
// @ author becxer parrotJ
// @ e-mail becxer87@gmail.com

var fs = require('fs');
var marked = require('marked');

//Classes
var md = {
    'type':'md',
    'title':'md file title',
    'content':'md file content',
    'path':'path from mdroot',
    'mtime':'edit time(file system time)'
};

var dir = {
    'type':'dir',
    'title' : 'dir title',
    'path' : 'path form mdroot',
    'mtime' : 'edit time(file system time)'
};

module.exports ={
    root : 'default mdroot to be initialize',
    trash : 'default mdtrash to be initialize',

    cvt2abpath : function(path){
        return this.root + "/" + path;
    },

    init : function(root_path,trash_path){
        this.root = root_path;
        this.trash = trash_path;
    },

    find_dirs : function(path){
        var abpath = this.cvt2abpath(path);
        var dirs = [];
        var files = [];
        try{
            files = fs.readdirSync(abpath);
        }catch(e){
            files = [];
        }
        for (i in files){
            var filename = files[i];
            var stat = fs.statSync(abpath + '/' + filename);
            if (stat.isDirectory() && filename != ".git") {
                var mdpath = ''+path+'/'+filename;
                dirs.push({
                'type':'dir',
                'title':filename, 
                'path': mdpath,
                'mtime':stat.mtime
                });
            }
        }
        dirs.sort(function(a,b){
            return a.title > b.title ? 1 : a.title < b.title ? -1 : 0;
        });
        return dirs;    
    },

    find_mds : function(path, sort_by, size, start, end){
        var abpath = this.cvt2abpath(path);
        var mds = [];
        var inner_mds = [];

        if(fs.existsSync(abpath+'.md') && fs.statSync(abpath+'.md').isFile()){
            mds.push(this.read_md(path));
            return mds;
        }

        var files = fs.readdirSync(abpath);
        for(i in files){
            var filename = files[i];
            var stat = fs.statSync(abpath + '/' + filename);
            var ext = filename.substring(filename.lastIndexOf(".")+1);
            if ( stat.isDirectory() && filename != ".git" ) {
                inner_mds.push(this.find_mds(path + '/' +filename, sort_by, size));
            }else if(stat.isFile() && ext == 'md'){
                var origin_content = fs.readFileSync(abpath + '/' + filename,'utf-8');
                if (size != undefined){
                    origin_content = origin_content.split("\n").slice(0,size).join("\n");
                }
                var content = marked(origin_content);
                var title = filename.split(".")[0];
                var mdpath = ''+path+'/'+title;
                   mds.push({
                'type':'md',
                'title':title, 
                'content':content, 
                'path':mdpath, 
                'mtime':stat.mtime
                });
            }
        }

        sort_func = function(a,b){return 1;};
        switch(sort_by){
        case 'ascend' : sort_func = function(a,b){
            return a.title > b.title ? 1 : a.title < b.title ? -1 : 0; };
            break;
        case 'descend' : sort_func = function(a,b){
            return a.title < b.title ? 1 : a.title > b.title ? -1 : 0; };
            break;
        case 'last_update' : sort_func = function(a,b){
            return a.mtime < b.mtime ? 1 : a.mtime > b.mtime ? -1 : 0; };
            break;
        default :sort_func = function(a,b){return 1;};
            break;
        }
        if(sort_by != 'last_update')mds.sort(sort_func);
        for (i in inner_mds){
            mds = mds.concat(inner_mds[i])
        }
        if(sort_by == 'last_update') mds.sort(sort_func);

        if(start == undefined) start = 0;
        if(end == undefined) end = mds.length;
        mds = mds.slice(start,end);
        return mds;
    },

    add_dir : function(path, dir_name){
        
    },

    remove_dir : function(path, dir_name){
        
    },
    
    read_md : function(path){
        var abpath = this.cvt2abpath(path) + ".md";
        var title = path.substring(path.lastIndexOf("/")+1);
        var content = marked(fs.readFileSync(abpath,'utf-8'));
          var md = {
        'type':'md',
        'title': title, 
        'content':content, 
        'path':path,
        'mtime': fs.statSync(abpath).mtime
        };
        return md;
    },
    
    read_md_pure : function(path){
        var abpath = this.cvt2abpath(path) + ".md";
        var title = path.substring(path.lastIndexOf("/")+1);
        var content = fs.readFileSync(abpath,'utf-8');
          var md = {
        'type':'md',
        'title': title, 
        'content':content, 
        'path':path,
        'mtime': fs.statSync(abpath).mtime
        };
        return md;
    },

    update_md : function(path, md_content){
        var abpath = this.cvt2abpath(path) + ".md";
        fs.writeFileSync(abpath, md_content);
        return this.read_md(path);
    },

    remove_md : function(path){
        var srcpath = this.cvt2abpath(path) + ".md";
        var title = path.substring(path.lastIndexOf("/")+1);
        var content = fs.readFileSync(srcpath,'utf-8');
        var trgpath = this.trash + "/" + title + ".md";
        fs.writeFileSync(trgpath, content);
        fs.unlinkSync(srcpath);
        return;
    }
};
