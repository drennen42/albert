var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  nodemailer = require('nodemailer'),
  User = mongoose.model('user');

function sendEmail(recipient, subject, text, body) {
  var transporter = nodemailer.createTransport('smtps://sched.made.ez%40gmail.com:A1b3rt123@smtp.gmail.com'),

  // setup e-mail data with unicode symbols
  mailOptions = {
      from: '"Scheduling Made EZ" <sched.made.ez@gmail.com>', // sender address
      // to: 'drennen42@gmail.com', // list of receivers
      // subject: 'There Are New Events On The Horizon!', // Subject line
      // text: 'Hello world 🐴', // plaintext body
      // html: '<b>Hello world 🐴</b>' // html body
      to: recipient,
      subject: subject,
      text: text,
      html: body
  };

  console.log('******** clicked the send email button!!!!!!!!!!');
  transporter.sendMail(mailOptions, function(error, info){
      if(error){
          return console.log(error);
      }
      console.log('Message sent: ' + info.response);
  });
};


module.exports = function (app) {
  app.use('/', router);
};

router.get('/users/:id/sendEmail', function(req, res, next) {
  User.findById(req.params.id, function(err, user) {
    if (err)
      res.send(err)
    console.log('send email triggered for: ', user);
    sendEmail(user.email, 'This is a test email from Scheduling Made EZ', 'Hello, ' + user.first_name + '!', '<b>Hello, ' + user.first_name + '!</b>');
    res.redirect('/users/' + newUser._id);
  });
});

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
    phone = req.body.phone,
    password = req.body.password;
    
  var newUser = new User({first_name: first_name, last_name: last_name, username: username, email: email, phone: phone, password: password});
    
  newUser.save(function (err) {
    if (err) {
        console.log('save error', err);
    }

    res.redirect('/users/' + newUser._id);
  });
});

router.post('/users/:id/delete', function (req, res, next) {

  // User.findById({id: req.params.id}).remove().exec();

  User.findByIdAndRemove(req.params.id, function(err) {
    if (err)
      res.send(err);
    res.send('User removed!');
    console.log('User removed!');
  });
    
  res.redirect('/users');
});

router.get('/users/:id/update', function (req, res, next) {
  User.findById(req.params.id, function(err, user) {
    if (err)
      res.send(err)
    res.render('Users/update', {user});
  });
});

router.post('/users/:id/update', function (req, res, next) {
  var first_name = req.body.first_name,
    username = req.body.username,
    last_name = req.body.last_name,
    email = req.body.email,
    phone = req.body.phone;
    // password = req.body.password;
    
  User.findOneAndUpdate({_id: req.params.id}, {first_name: first_name, last_name: last_name, username: username, email: email, phone: phone}, function (err, user) {
    if (err)
      res.send(err)

    res.redirect('/users/' + req.params.id);
  });
});

router.get('/users/new', function (req, res, next) {
  res.render('Users/new');
});

router.get('/users/:id', function(req, res, next) {
  User.findOne({_id: req.params.id}, function(err, user) {
    if (err)
      res.send(err);
    req.session.user = user;

    res.render('Users/show', {user});
  });
});