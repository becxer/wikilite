##탭 구현 완료

    var mds = [];
    var content = fs.readFileSync('./README.md','utf-8');
    var html = markdown.toHTML(content);
    mds.push(html);

	res.render('index',{'dirs':dirs, 'mds':mds});

----------------------------------------------------------------------------

    var content = fs.readFileSync('./README.md','utf-8');
    var html = markdown.toHTML(content);
 
	res.render('index',{'dirs':dirs, 'mds':html});
	이해는 가지 않지만 스트링 형태로 출력이 되네요. 마크다운이 않되서 mds배열 만들어서 했습니다.