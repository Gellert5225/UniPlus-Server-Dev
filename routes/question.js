var express = require('express');
var path = require('path');
var router = express.Router();

router.get("/questions", function(req,res){ // display all questions
});

router.get("/questions/:id", function(req,res){
  var Question = Parse.Object.extend("Questions");
  var query = new Parse.Query(Question);
  query.get(req.params.id)
  .then((question) => {
    res.status(200).render('question', {question: question});
  }, (error) => {
    console.log(error);
  });
});

module.exports = router;