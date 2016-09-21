var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  nodemailer = require('nodemailer'),
  User = mongoose.model('user'),
  CasinoGame = mongoose.model('casinoGame'),
  Event = mongoose.model('event'),
  UserEvent = mongoose.model('userEvent');

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
  app.use('/users', router);
};

router.get('/:id/sendEmail', function(req, res, next) {
  User.findById(req.params.id, function(err, user) {
    if (err) res.send(err)
    var emailBody = `<head><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.0.0-alpha/js/bootstrap.min.js"></head>
                    <div class="container">
                      <div class="navbar" style="border: 2px solid black; margin: 10px; width:95%">
                        <p style="text-align: center; font-size:20px; color: red; vertical-align: middle;">Scheduling Made EZ</p>
                      </div>
                      <div class="main" style="margin-top: 10px; width:100%;">
                        <div style="width:100%;"><span style="font-size: 20px; text-align: center; color: blue; margin:10px;">This is a test email sent from Scheduling Made EZ!!</span></div>
                        <div style="width:100%; margin-top:10px"><span style="border: 2px solid black; margin:10px;">A Picture Could Go Here</span></div>
                        <div style="width:100%; margin-top:10px;"><span style="border: 2px solid black; margin:10px;">And Another Here</span></div>
                        <div style="width:100%; margin-top:10px;"><span style="border: 2px solid black; margin:10px;">As many as you want</span></div>
                      </div>
                      <div style="margin:10px;"><button type="button"><a href="http://10.0.0.31:3001" class="btn btn-primary">Visit S.M.EZ</a></button></div>
                    </div>`;
    sendEmail(user.email, 'This is a test email from Scheduling Made EZ', 'Hello, ' + user.first_name + '!', '<b>Hello, ' + user.first_name + '!</b>' + emailBody);
    res.redirect('/users/' + user._id);
  });
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

router.get('/', function (req, res, next) {
  if (!req.session.user || !req.session.user.is_admin) {
      res.status(403).render('index', {
          title: 'Sheduling Made Easy',
          err: [{message: 'Unauthorized'}]
        });
  } else {
    User.find( function (err, users) {
      if (err) res.send(err);
      res.render('Users/users', {users});
    });
  }
});

router.post('/users/new', function (req, res, next) {
  //Retrieve data
  var first_name = req.body.first_name,
    username = req.body.username,
    last_name = req.body.last_name,
    email = req.body.email,
    phone = req.body.phone,
    games = req.body.games,
    rank = req.body.rank,
    hourly_rate = req.body.hourly_rate,
    active = (req.body.active == "true") ? true : false,
    password = req.body.password;
    
  var newUser = new User({isAdmin: false, active: active, games: games, hourly_rate: hourly_rate, rank: rank, first_name: first_name, last_name: last_name, username: username, email: email, phone: phone, password: password});
    
  newUser.save(function (err) {
    if (err) {
        console.log('save error', err);
        res.send(err);
    }

    res.redirect('/' + newUser._id);
  });
});

router.post('/:id/delete', function (req, res, next) {
  User.findById({id: req.params.id}, function(err, user) {
    if (err) res.send(err)
    if (req.session.user._id != user._id && req.session.user.is_admin == false) {
      res.status(403).render('index', {
          title: 'Sheduling Made Easy',
          err: [{message: 'Unauthorized'}]
        });
    }
  });

  User.findByIdAndRemove(req.params.id, function(err) {
    if (err) res.send(err);
    res.send('User removed!');
    console.log('User removed!');
  });
    
  res.redirect('/');
});

router.get('/:id/update', function (req, res, next) {
  var selectedGames = [],
    otherGames = [];
  User.findById(req.params.id, function(err, user) {
    if (err) res.send(err);
    for (var i = 0; i < user.games.length; i++) {
      CasinoGame.findById(user.games[i], function(err, game) {
        if (err) return next(err);
        selectedGames.push(game);
      });
    }
    CasinoGame.find( function (err, casinoGames) {
      if (err) return next(err);
      for (var i = 0; i < casinoGames.length; i++) {
        if (!(!!selectedGames[i] && !!selectedGames.indexOf(casinoGames[i]))) {
          otherGames.push(casinoGames[i]);
        };
      };
      res.render('Users/update', {user: user, games: otherGames, selectedGames: selectedGames});
    });
  });
});

router.post('/:id/update', function (req, res, next) {
  var first_name = req.body.first_name,
    username = req.body.username,
    last_name = req.body.last_name,
    email = req.body.email,
    phone = req.body.phone,
    games = req.body.games,
    rank = req.body.rank,
    is_admin = (req.body.is_admin == "true") ? true : false,
    hourly_rate = req.body.hourly_rate,
    active = (req.body.active == "true") ? true : false;
    
  if (!!req.body.password) {
    var password = req.body.password;

    User.findOneAndUpdate({_id: req.params.id}, {is_admin: is_admin, hourly_rate: hourly_rate, password: password, active: active, rank: rank, first_name: first_name, last_name: last_name, username: username, email: email, phone: phone, games: games}, function (err, user) {
      if (err)
        res.send(err);

      res.redirect('/' + req.params.id);
    });
  } else {
    User.findOneAndUpdate({_id: req.params.id}, {is_admin: is_admin, hourly_rate: hourly_rate, active: active, rank: rank, first_name: first_name, last_name: last_name, username: username, email: email, phone: phone, games: games}, function (err, user) {
      if (err)
        res.send(err);

      res.redirect('/' + req.params.id);
    });
  };
});

router.get('/new', function (req, res, next) {
  CasinoGame.find( function (err, casinoGames) {
      if (err) return next(err);
      res.render('Users/new', {games: casinoGames});
  });
});

router.get('/:id', function(req, res, next) {
  if (!req.session.user || !req.session.user.is_admin) {
      // res.send('Unauthorized!!');
      res.status(403).render('index', {
          title: 'Sheduling Made Easy',
          err: [{message: 'Unauthorized'}]
        });
  } else {
    var games = [];

    User.findOne({_id: req.params.id})
      .populate('games')
      .exec(function(err, user) {
        if (err) res.send(err);
      res.render('Users/show', {user});
    });
  }
});