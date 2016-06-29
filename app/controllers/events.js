var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Event = mongoose.model('event'),
  User = mongoose.model('user'),
  CasinoGame = mongoose.model('casinoGame'),
  Client = mongoose.model('client');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/events', function (req, res, next) {
  Event.find( function (err, events) {
    if (err) return next(err);
    res.render('Events/events', {events});
  });
});

router.get('/events/new', function (req, res, next) {
  Client.find( function (err, clients) {
    if (err) return next(err);
    CasinoGame.find( function (err, casinoGames) {
      if (err) return next(err);
      User.find( function (err, users) {
        if (err) return next(err);
        res.render('Events/new', {clients: clients, games: casinoGames, workers: users});
      });
    });
  });
});

router.post('/events/new', function (req, res, next) {
  //Retrieve data
  var name = req.body.name,
    hostname = req.body.hostname,
    client = req.body.client,
    num_employees = req.body.num_employees,
    games = req.body.games,
    workers = req.body.workers;

  var newEvent = new Event({name: name, hostname: hostname, num_employees: num_employees, client: client, games: games, workers: workers});
    
  newEvent.save(function (err) {
    if (err) {
        console.log('save error', err);
        res.send(err);
    }
  });

  res.redirect('/events/' + newEvent._id);
});

router.get('/events/:id', function(req, res, next) {
  Event.findOne({_id: req.params.id})
    .populate('client')
    .populate('games')
    .populate('workers')
    .exec(function(err, event) {
      if (err)
        res.send(err);
      res.render('Events/show', {event});
  });
});

router.post('/events/:id', function (req, res, next) {
  console.log('inside the delete function');

  // Event.findById({id: req.params.id}).remove().exec();

  Event.findByIdAndRemove(req.params.id, function(err) {
    if (err)
      res.send(err);

    console.log('Event removed from the locker!: ');
  });
    
  res.redirect('/events');
});