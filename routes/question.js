var express = require('express');
var path = require('path');
var router = express.Router();

var answerSchema = {
  answer: Parse.Object,
  currentUserVote: String,
  comments: []
};

router.get("/questions", function(req,res){ // display all questions
});

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

router.get("/questions/:id", async function(req,res){
  var answerSchemas = [];
  var Question = Parse.Object.extend("Questions");
  var query = new Parse.Query(Question);
  query.include('user');
  query.get(req.params.id)
  .then((question) => {
    var questionCommentsRelation = question.relation('comments');
    var questionCommentsQuery = questionCommentsRelation.query();
    questionCommentsQuery.find().then(async(comments) => {
      var answerRelation = question.relation("answers");
      var answerQuery = answerRelation.query();
      answerQuery.include("author");
      answerQuery.descending("createdAt");
      answerQuery.find().then(async(answers) => {
        var relation = question.relation("votes");
        var query = relation.query();
        query.equalTo('fromUser', Parse.User.current());
        query.equalTo('toQuestion', question);
        query.find().then(async(results) => {
          await asyncForEach(answers, async (answer) => {
            var ansVoteRelation = answer.relation('votes');
            var ansCommentRelation = answer.relation('comments');

            var query = ansVoteRelation.query();
            var ansCommentQuery = ansCommentRelation.query();

            query.equalTo('fromUser', Parse.User.current());

            const answerVotes = await query.find();
            const answerComments = await ansCommentQuery.find();

            var ansVote;
            if (answerVotes.length) {
              ansVote = answerVotes[0].get('type');
            } else {
              ansVote = 'none';
            }
            answerSchemas.push({
              answer: answer,
              currentUserVote: ansVote,
              comments: answerComments
            });
          });
          var voteStat;
          if (results.length) {
            if (results[0].get('type') == 'upVote') {
              voteStat = 'upVote';
            } else {
              voteStat = 'downVote';
            }
          } else {
            voteStat = 'none';
          }
          res.status(200).render('question', {question: question, questionComments: comments, answers: answerSchemas, currentUserVoteStat: voteStat});
        },(error) => {
            console.log('Error: ' + error.code + ' ' + error.message);
        });
      }, (error) => {
        console.log(error);
      });
    }, (error) => {
      console.log(error);
    });
  }, (error) => {
    console.log(error);
  });
});

module.exports = router;