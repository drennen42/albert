var express = require('express'),
  router = express.Router(),
  $ = require('jquery'),
  mongoose = require('mongoose'),
  Event = mongoose.model('event'),
  User = mongoose.model('user'),
  UserEvent = mongoose.model('userEvent'),
  CasinoGame = mongoose.model('casinoGame'),
  Client = mongoose.model('client'),
  EventGame = mongoose.model('eventGame'),
  moment = require('moment'),
  gameQuery = CasinoGame.find(function(err, cGames){
    if (err) res.send(err);
    return cGames;
  }),
  concatName = (name) => name.split(' ').join(''),
  countGames = (event) => {
    // return events.map((event) => {
      var gameNames = [],
          returnObj = {},
          returnStr = '';
      event.eventGames.map((evtGame) => {
        gameNames.push(evtGame.game.name);
      });

      for (var i = 0; i < gameNames.length; i++) {
        returnObj[gameNames[i]] = returnObj[gameNames[i]] || 0;
        returnObj[gameNames[i]] = returnObj[gameNames[i]] + 1;
      }

      Object.keys(returnObj).forEach((k) => returnStr = returnStr + `<tr><td>${returnObj[k]} ${k}</td></tr>`);
      return returnStr;
    // });
  };

module.exports = function (app) {
  app.use('/', router);
};

router.get('/events', function (req, res, next) {
  var sessUser = req.session.user;
  // console.log('request session user, sessUser: ', [req.session, !!sessUser]);
  Event.find()
    .populate({
      path: 'eventGames',
      populate: {path: 'game'}
    })
    .populate('client')
    .populate('workers')
    .populate('waitlist')
    .sort({'start_date': 'descending'})
    .exec(function (err, events) {
      if (err) res.send(err);
      res.render('Events/events', {events: events, sessUser: sessUser, helpers: {gameName: concatName, gameCount: countGames}});
    });
});

router.get('/events/new', function (req, res, next) {
  var sessUser = req.session.user;
  // TODO: Add this authorization back:
  // if (!!sessUser && !!sessUser.is_admin) {
    Client.find( function (err, clients) {
      if (err) return next(err);
      CasinoGame.find( function (err, casinoGames) {
        if (err) return next(err);
        User.find( function (err, users) {
          if (err) return next(err);
          res.render('Events/new', {clients: clients, games: casinoGames, workers: users, helpers: {
            gameName: concatName
          }});
        });
      });
    });
  // } else {
  //   res.status(403).render('index', {
  //         title: 'Sheduling Made Easy',
  //         err: [{message: 'Unauthorized'}]
  //       });
  // };
});

router.post('/events/new', function (req, res, next) {
  var name = req.body.name,
    hostname = req.body.hostname,
    client = req.body.client,
    workers = req.body.workers,
    start_date = req.body.start_date_date,
    end_date = req.body.end_date_date,
    location = req.body.location,
    description = req.body.description;
    blackjack = req.body["BlackJack"];

  var newEvent = new Event({
    name: name,
    hostname: hostname,
    client: client,
    start_date: moment(start_date, 'YYYY-MM-DDTHH:mm').toDate(),
    end_date: moment(end_date, 'YYYY-MM-DDTHH:mm').toDate(),
    workers: workers,
    location: location,
    description: description
  });

  newEvent.save(function (err) {
    if (err) res.send(err);
  });

  // to add/save games to the event
  gameQuery.exec()
  .then(function(args) {
    var numGames,
      gameName;

    for (var i in args) {
      gameName = args[i].name.split(' ').join('');
      numGames = Number(req.body[gameName]);
      if (numGames > 0) {
        for (var num = 0; num < numGames; num++) {
          var newEventGame = new EventGame({
            game: args[i]._id,
            event: newEvent._id
          });

          newEventGame.save(function (err) {
            if (err) res.send(err);
            newEvent.eventGames.push(newEventGame);
          });
        };
      }
    }
  });

  res.redirect('/events/' + newEvent._id);
});

router.get('/events/:event_id/addToWaitlist/:worker_id', function(req, res, next) {
  var event_id = req.params.event_id,
    worker_id = req.params.worker_id;

  User.findOne({_id: req.params.worker_id}, function(err, worker) {
    Event.findOne({_id: event_id})
      .populate('waitlist')
      .exec(function(err, event) {
        if (err) res.send(err);
        event.waitlist.push(worker);
        event.save(function(err){
          if (err) res.send(err);
        });
        res.redirect('/events/' + event_id);
    });
  })
});

router.post('/events/:id/update', function(req, res, next) {
  var name = req.body.name,
    hostname = req.body.hostname,
    client = req.body.client,
    num_employees = req.body.num_employees,
    games = req.body.games,
    workers = req.body.workers,
    start_date = req.body.start_date_date,
    start_date_time = req.body.start_date_time,
    end_date = req.body.end_date_date,
    end_date_time = req.body.end_date_time,
    summary = req.body.summary,
    location = req.body.location,
    description = req.body.description,
    start,
    end,
    attendees = [];

  var workerQuery = User.find({'_id': { $in: workers}}, 'email', function(err, docs){
    if (err) res.send(err);
    return docs;
  });

  var workerPromise = workerQuery.exec();
  workerPromise.onFulfill(function(args) {
    for (var i in args) {
      attendees.push({'email': args[i].email});
    }
  });

  Event.findOneAndUpdate({_id: req.params.id}, {
    name: name, 
    hostname: hostname, 
    num_employees: num_employees, 
    client: client, 
    start_date: start_date.toDate(), 
    end_date: end_date.toDate(), 
    games: games, 
    workers: workers,
    summary: summary,
    location: location,
    description: description
  }, function(err, event) {
    if (err) res.send(err);
    res.redirect('/events/' + req.params.id);
  });
});

router.get('/events/:id', function(req, res, next) {
  Event.findOne({_id: req.params.id})
  .populate('client')
  .populate('workers')
  .populate('waitlist')
  // .populate('eventGames')
  .populate({
    path: 'eventGames',
    populate: {path: 'game'}
  })
  .exec(function(err, event) {
    if (err) res.send(err);
    // EventGame.find({event: event}).populate('game event').exec(function(err, egs) {
      // if (err) res.send(err);
      // event.eventGames = egs;
      // event.populate('eventGames');
      // event.save(function(err){
        // if (err) res.send(err);
      // });
      // event.populate('eventGames');
      // console.log('EVENT: ', event);
    // });

    res.render('Events/show', {event, helpers: {gameName: concatName, gameCount: countGames}});
  });
});

router.get('/events/:id/games', function(req, res, next) {
  Event.findById(req.params.id)
  .exec(function(err, event) {
    if (err) res.send(err)
    EventGame.find({event: event._id})
    .populate({
      path: 'event',
      populate: {path: 'workers'}
    })
    .populate({
      path: 'game',
      populate: {path: 'dealer'}
    })
    .exec(function(err, evtGames) {
      if (err) res.send(err)
      console.log('EVTGAMES: ', evtGames);
      res.render('Events/eventGames', {evtGames});
    })
  })
});

router.get('/events/:id/edit', function(req, res, next) {
  Client.find( function (err, clients) {
      if (err) return next(err);
      CasinoGame.find( function (err, casinoGames) {
        if (err) return next(err);
        User.find( function (err, users) {
          if (err) return next(err);
          Event.findById(req.params.id)
            .populate('client')
            .populate('games')
            .populate('workers')
            .populate('waitlist')
            .exec(function(err, event) {
              if (err) res.send(err);
              res.render('Events/update', {event, clients: clients, games: casinoGames, workers: users, helpers: {
                gameName: (name, options) => name.split(' ').join('')
              }});
        });
      });
    });
  });
});


router.post('/events/:id/delete', function (req, res, next) {
  Event.findByIdAndRemove(req.params.id, function(err) {
    if (err) res.send(err);
    console.log('Event removed from the database!');
  });
  res.redirect('/events');
});
