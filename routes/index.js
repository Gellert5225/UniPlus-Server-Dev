var express = require('express');
var path = require('path');
var router = express.Router();

router.get('/', function(req, res) {
  res.status(200).render('landing');
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

router.post('/login', function(req, res) {
  Parse.User.logIn(req.body.username, req.body.password, {
    success: function(user) {
      req.session.user = user;
      res.redirect('back');
    },
    error: function(user, error) {
      console.log('Error: ' + error.message);
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

      res.redirect('back');
    },
    error: function(user, error) {
      console.log('Error: ' + error.message);
      req.flash("signupError", error.message);
      return res.redirect('back');
    }
  });
});

module.exports = router;