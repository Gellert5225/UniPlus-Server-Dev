var express = require('express');
var path = require('path');
var router = express.Router();

router.get("/questions", function(req,res){ // display all questions
});

router.get("/questions/:id", function(req,res){
  var Question = Parse.Object.extend("Questions");
  var query = new Parse.Query(Question);
  query.include('user');
  query.get(req.params.id)
  .then((question) => {
    var relation = question.relation("votes");
    var query = relation.query();
    query.equalTo('fromUser', Parse.User.current());
    query.find({
      success: function(results) {
        if (results.length) {
          console.log(results[0]);
          if (results[0].get('type') == 'upVote')
            res.status(200).render('question', {question: question, currentUserVoteStat: 'upVote'});
          else
            res.status(200).render('question', {question: question, currentUserVoteStat: 'downVote'});
        } else {
            console.log('not found');
            res.status(200).render('question', {question: question, currentUserVoteStat: 'none'});
        }
      },
      error: function(error) {
        console.log('Error: ' + error.code + ' ' + error.message);
      }
    });
  }, (error) => {
    console.log(error);
  });
});

module.exports = router;