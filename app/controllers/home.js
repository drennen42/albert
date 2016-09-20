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

router.get('/', function (req, res, next) {
    if (req.session.user) {
      // User.findOne({username: req.body.username}, function(err, user) {
      User.findOne(req.session.user, function(err, sessUser) {
        res.render('index', {
          title: 'Sheduling Made Easy',
          sessUser: sessUser
        });
      });

    } else {
      console.log('no session user');
      res.render('index', {
        title: 'Sheduling Made Easy'
      });
      // req.session.error = 'Access denied!';
      // res.redirect('/login');
    }
});


router.get('/login', function (req, res, next) {
  res.render('Users/login');
});

router.post('/login', function (req, res, next) {
  User.findOne({$or: [{username: req.body.username}, {email: req.body.username}]}, function(err, user) {
    if (err) res.send(err)

    // user.verifyPassword(req.body.password, function(err, valid) {
    //   if (err) {
    //     // console.log('password error: ', err);
    //     res.render('Users/login', {err: err});
    //   } else if (!valid) {
    //     // console.log('Invalid Password!!');
    //     res.status(401).render('Users/login', {err: [{message: 'Incorrect Password'}]});
    //   } else {
        // console.log('Password valid?: ', valid);
        // console.log('req password, user password: ', [req.body.password, user.password]);
        req.session.user = user;
        user.is_logged_in = true;
        user.save(function(err) {
          if (err) res.send(err)
        });
        res.redirect('/');
      // };
    // });
  });
});

router.get('/logout', function (req, res, next) {
  User.findOneAndUpdate({is_logged_in: true}, {is_logged_in: false}, function(err, user) {
    if (err)
      res.send(err)
  
    req.session.user = '';
    res.redirect('/');
  });
});

router.get('/forgotPassword', function (req, res, next) {
    res.render('Users/forgotPassword');
});

router.post('/forgotPassword', function(req, res, next) {
  var randomPass = Math.random().toString(36).slice(-8);
  console.log('request body username: ', req.body.username);
  User.findOne({ $or: [{username: req.body.username}, {email: req.body.username}]}, function(err, user) {
    if (err) res.send(err)
    user.password = randomPass;
    user.save(function(err) {
      if (err) res.send(err);
    
      var emailBody = `<head><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.0.0-alpha/js/bootstrap.min.js"></head>
  <div class="container">
    <div class="navbar" style="border: 2px solid black; margin: 10px; width:95%">
      <p style="text-align: center; font-size:20px; color: red; vertical-align: middle;">Scheduling Made EZ</p>
    </div>
    <div class="main" style="margin-top: 10px; width:100%;">
      <div style="width:100%;"><span style="font-size: 20px; text-align: center; color: blue; margin:10px;">Your password has been reset</span></div>
      <div style="width:100%;"><span style="font-size: 16px; text-align: center; margin:10px;">Your temp password is: ${randomPass}</span></div>

    </div>
    <div style="margin:10px;"><button type="button"><a href="http://www.schedmdez.com/login" class="btn btn-primary">Login To S.M.EZ</a></button></div>
  </div>`;

      console.log('send email triggered for: ', user);
      sendEmail(user.email, 'Scheduling Made EZ Password Reset', 'Hello, ' + user.first_name + '!' + `Your temp password is: ${randomPass}`, '<b>Hello, ' + user.first_name + '!</b>' + emailBody);
      res.redirect('/login');
    });
  });
});