var express = require('express');
var router = express.Router();
var path           = require('path');

router.get('/', function(req, res) {
  res.status(200).render('landing');
});

router.get('/test', function(req, res) {
  res.sendFile(path.join(__dirname, '../public/test.html'));
});

module.exports = router;