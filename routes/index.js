var express = require('express');
var path = require('path');
var router = express.Router();

router.get('/test', function(req, res) {
  var Question = Parse.Object.extend("Questions");
  var query = new Parse.Query(Question);
  query.get("AUtOVIRO04")
  .then((question) => {
    var body = question.get('bodyRaw');
    res.status(200).render('test', { bodyString : body });
  }, (error) => {
    console.log(error);
  });
});

router.get('/', function(req, res) {
  const Question = Parse.Object.extend("Questions");
  const query = new Parse.Query(Question);
  query.limit(10);

  if (req.query.sort == 'feature') {
    query.descending("upVotes"); 
  } else if (req.query.sort == 'unanswer') {
    query.descending("createdAt");
    query.doesNotExist('correctAnswer');
  } else { 
    query.descending("createdAt"); 
  }

  query.include("user");
  query.find({
    success: function(results) {
      res.status(200).render('landing', { questions : results });
    },
    error: function(error) {
      console.log('Error: ' + error.code + ' ' + error.message);
    }
  });
});

router.get('/login', function(req, res) {
  res.status(200).render('login.ejs');
});

router.get('/register', function(req, res) {
  res.status(200).render('register.ejs');
});

router.get('/logout', function(req, res) {
  req.session = null;
  res.redirect('back');
});

router.get('/ask', function(req, res) {
  if (!Parse.User.current()) {
    req.flash('askError', 'You need to log in to post a question');
    res.redirect('back');
  } else {
    res.status(200).render('askQuestion');
  }
});

router.post('/postQuestion', function(req, res) {
  const Question = Parse.Object.extend("Questions");
  const question = new Question();

  question.set("solved", false);
  question.set("upVotes", 0);
  question.set("views", 0);
  question.set("numberOfComments", 0);
  question.set("numberOfFavs", 0);
  question.set("title", req.body.title);
  question.set("bodyRaw", req.body.body);
  question.set("user", Parse.User.current());

  res.send('/');

  question.save().then((gameScore) => {
    console.log('New object created with objectId: ' + question.id);
    req.flash("success", 'Successfully posted question with id ' + question.id);
  }, (error) => {
    console.log('Failed to create new object, with error code: ' + error.message);
  });
});

router.post('/login', function(req, res) {
  Parse.User.logIn(req.body.username, req.body.password, {
    success: function(user) {
      req.session.user = user;
      Parse.User.become(user._sessionToken).then(function (user) {
        console.log(user);
      }, function (error) {
      });
      res.redirect('back');
    },
    error: function(user, error) {
      req.flash('loginError', error.message);
      return res.redirect('back');
    }
  });
});

router.post('/register', function(req, res) {
  var user = new Parse.User();
  user.set('username', req.body.username);
  user.set('password', req.body.password);
  user.set('email', req.body.email);

  user.signUp(null, {
    success: function(user) {
      req.session.user = user;
      Parse.User.become(user._sessionToken).then(function (user) {
        console.log(user);
      }, function (error) {
      });
      res.redirect('back');
    },
    error: function(user, error) {
      req.flash("signupError", error.message);
      return res.redirect('back');
    }
  });
});

router.get('/docs', function(req, res) {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

module.exports = router;