var express = require('express');
var router = express.Router();
var uuid = require('node-uuid');
/* GET home page. */

router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});
var registry = {};
var responses = {};
router.post('/authenticate',function(req,res){
	if (req.body.username == 'apio' && req.body.password == 'apio')
		res.send(200,{status:true,token:uuid.v4()})
	else
		res.send(401)
})
module.exports = router;
