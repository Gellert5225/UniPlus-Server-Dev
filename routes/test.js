var express = require('express');
var path = require('path');
var router = express.Router();

router.get('/test', function(req, res) {
  res.sendFile(path.join(__dirname, '../public/test.html'));
});

router.get('/test1', function(req, res) {
  res.render('test.ejs');
});

router.get('/question', function(req, res) {
  
});

module.exports = router;