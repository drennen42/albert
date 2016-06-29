var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  User = mongoose.model('user');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/users', function (req, res, next) {
  User.find( function (err, users) {
    if (err) return next(err);
    res.render('Users/users', {users});
  });
});

router.post('/users/new', function (req, res, next) {
  //Retrieve data
  var first_name = req.body.first_name,
    username = req.body.username,
    last_name = req.body.last_name,
    email = req.body.email,
    password = req.body.password;
    
  var newUser = new User({first_name: first_name, last_name: last_name, username: username, email: email, password: password});
    
  newUser.save(function (err) {
    if (err) {
        console.log('save error', err);
    }

    res.redirect('/users/' + newUser._id);
  });
});

router.post('/users/:id', function (req, res, next) {
  console.log('inside the delete function');

  // User.findById({id: req.params.id}).remove().exec();

  User.findByIdAndRemove(req.params.id, function(err) {
    if (err)
      res.send(err);

    console.log('User removed from the locker!: ');
  });
    
  res.redirect('/users');
});

router.get('/users/new', function (req, res, next) {
  res.render('Users/new');
});



router.get('/users/:id', function(req, res, next) {
  User.findOne({_id: req.params.id}, function(err, user) {
    if (err)
      res.send(err);
    req.session.user = user;
    console.log('session obj: ', req.session);

    console.log('current user: ', [user.first_name, user.last_name, user.email, user.username]);

    res.render('Users/show', {user});
  });
});