var express = require('express');
var router = express.Router();

var autogitpull = function(){
	var spawn=require('child_process').spawn;
	var git = spawn('git',['pull', 'origin', 'master']);
	console.log(git);
};

/* GET users listing. */
router.post('/', function(req, res, next) {
  res.send('respond with a resource');
  console.log("github called autodeploy");
  autogitpull();
});

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
  console.log("user called autodeploy");  
  autogitpull();
});

module.exports = router;
