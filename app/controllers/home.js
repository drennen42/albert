var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  User = mongoose.model('user');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
    // if (req.session.user) {
    //   console.log('session user: ', req.session.user);
    //   // User.findOne({username: req.body.username}, function(err, user) {
    //   User.findOne(req.session.user, function(err, sessUser) {
    //     res.render('index', {
    //       title: 'Sheduling Made Easy',
    //       sessUser: sessUser
    //     });
    //   });

    // } else {
      res.render('index', {
        title: 'Sheduling Made Easy'
      });
      // req.session.error = 'Access denied!';
      // res.redirect('/login');
    // }
});

router.get('/login', function (req, res, next) {
  res.render('Users/login');
});

router.post('/login', function (req, res, next) {
  User.findOne({username: req.body.username}, function(err, user) {
    if (err) {
      console.log('Cannot find user error: ', err);
      res.send(err); 
    } else {
      console.log('found user: ', user);
      req.session.user = user;
      console.log('request session: ', req.session);
      // res.render('Users/show', {user});
      res.redirect('/users/' + user._id);
    }
    // user.password.verifyPassword(req.params.password, function(err, valid) {
    //   if (err)
    //     console.log('password error: ', err);
    //     res.send('Incorrect Password');
    //   next();
    // });
  });
});

router.get('/logout', function (req, res, next) {
  req.session.user = '';
  res.redirect('/');
})