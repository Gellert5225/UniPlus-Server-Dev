var express = require('express');
var path = require('path');
var router = express.Router();

var answerSchema = {
  answer: Parse.Object,
  currentUserVote: String
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
              console.log(answer);
              var ansVoteRelation = answer.relation('votes');
              var query = ansVoteRelation.query();
              query.equalTo('fromUser', Parse.User.current());
              const answerVotes = await query.find();
              if (answerVotes.length) {
                console.log('found a vote');
                answerSchemas.push({
                  answer: answer,
                  currentUserVote: answerVotes[0].get('type')
                });
              } else {
                answerSchemas.push({
                  answer: answer,
                  currentUserVote: 'none'
                });
              }
            });
            if (results.length) {
              if (results[0].get('type') == 'upVote') {
                res.status(200).render('question', {question: question, answers: answerSchemas, currentUserVoteStat: 'upVote'});
              } else {
                res.status(200).render('question', {question: question, answers: answerSchemas, currentUserVoteStat: 'downVote'});
              }
            } else {
                res.status(200).render('question', {question: question, answers: answers, currentUserVoteStat: 'none'});
            }
          },
          (error) => {
            console.log('Error: ' + error.code + ' ' + error.message);
          }
        );
      }, (error) => {
        console.log(error);
      }
    );
  }, (error) => {
    console.log(error);
  });
});

module.exports = router;