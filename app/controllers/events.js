var express = require('express'),
  $ = require('jquery'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Event = mongoose.model('event'),
  User = mongoose.model('user'),
  UserEvent = mongoose.model('userEvent'),
  CasinoGame = mongoose.model('casinoGame'),
  Client = mongoose.model('client'),
  addGoogEvent = require('../../quickstart.js').addNewEvent,
  updateGoogEvent = require('../../quickstart.js').updateNewEvent,
  moment = require('moment');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/events', function (req, res, next) {
  var sessUser = req.session.user;
  // console.log('request session user, sessUser: ', [req.session, !!sessUser]);
  Event.find()
    .populate('games')
    .populate('client')
    .populate('workers')
    .exec(function (err, events) {
      if (err) return next(err);

      console.log('start date moment: ', events.start_date_moment);
      // events.end_date_moment();
      events.moment = moment;
      // console.log('events: ', events[1].start_date_moment());
      console.log('event date: ', events[1].start_date );
      console.log('event date moment: ', moment(events[1].start_date).format('YYYY-MM-DD'));
      events[1].display_start_date = moment(events[1].start_date).format('YYYY-MM-DD');
      console.log('events[1].display_start_date: ', events[1].display_start_date);
      res.render('Events/events', {events: events, sessUser: sessUser});
    });
});

router.get('/events/new', function (req, res, next) {
  Client.find( function (err, clients) {
    if (err) return next(err);
    CasinoGame.find( function (err, casinoGames) {
      if (err) return next(err);
      User.find( function (err, users) {
        if (err) return next(err);
        res.render('Events/new', {clients: clients, games: casinoGames, workers: users, helpers: {
          gameName: (name, options) => name.split(' ').join('')
        }});
      });
    });
  });
});

router.post('/events/new', function (req, res, next) {
  var cgs = [];

  // CasinoGame.find({}, function(err, games) {
  //   if (err) console.log('events/new POST finding casino games error: ', err);
  //   for (var g = 0; g < games.length; g++) {
  //     cgs.push(games[g]);
  //   }
  // });
  // console.log('CASINO GAMES: ', cgs);

  //Retrieve data
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

  start = moment(`${start_date} ${start_date_time}`, 'YYYY-MM-DD HH:mm').local();
  end = moment(`${end_date} ${end_date_time}`, 'YYYY-MM-DD HH:mm').local();

  var query = User.find({'_id': { $in: workers}}, 'email', function(err, docs){
    if (err) console.log(err);
    return docs;
  });

  var queryPromise = query.exec();
  queryPromise.onFulfill(function(args) {
    for (var i in args) {
      attendees.push({'email': args[i].email});
    };
  });

  var googEvent = {
    'summary': name,
    'location': location,
    'description': description,
    'start': {dateTime: start.format()},
    'end': {dateTime: end.format()},
    'attendees': attendees,
    // 'visibility': 'private',
    'reminders': {
      'useDefault': false,
      'overrides': [
        {'method': 'email', 'minutes': 24 * 60},
        {'method': 'popup', 'minutes': 10},
      ],
    },
  };

  addGoogEvent(googEvent, (x) => {
    console.log('x: ', x);
  });

  var newEvent = new Event({
    name: name, 
    hostname: hostname, 
    num_employees: num_employees, 
    client: client, 
    start_date: start.toDate(), 
    end_date: end.toDate(), 
    games: games, 
    workers: workers,
    summary: summary,
    location: location,
    description: description,
    start: start.toDate(),
    end: end.toDate(),
  });

  newEvent.save(function (err) {
    if (err) {
        console.log('save error', err);
        res.send(err);
    }
  });

  newEvent.workers.forEach(function(worker) {
    console.log('worker: ', worker);
    console.log('event: ', newEvent);
    var newUserEvent = new UserEvent({
      user: worker,
      hourly_rate: worker.hourly_rate,
      event: newEvent
    });
    newUserEvent.save(function(err) {
      if (err) {
        console.log('save error', err);
        res.send(err);
      }
    });
  });
  


  // for (var worker in workers) {
  //   User.findById(worker._id, function(err, user){
  //     if (err) console.log('error adding event to worker: ', err);
  //     console.log('*** USER **** : ', user);
  //     // user.events = user.events.push(newEvent);
  //   });
  // };

  res.redirect('/events/' + newEvent._id);
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

  start = moment(`${start_date} ${start_date_time}`, 'YYYY-MM-DD HH:mm').local();
  end = moment(`${end_date} ${end_date_time}`, 'YYYY-MM-DD HH:mm').local();

  var query = User.find({'_id': { $in: workers}}, 'email', function(err, docs){
    if (err) console.log(err);
    return docs;
  });

  var queryPromise = query.exec();
  queryPromise.onFulfill(function(args) {
    for (var i in args) {
      attendees.push({'email': args[i].email});
    }
  });

  var googEvent = {
    'summary': name,
    'location': location,
    'description': description,
    'start': {dateTime: start.format()},
    'end': {dateTime: end.format()},
    'attendees': attendees,
    // 'visibility': 'private',
    'reminders': {
      'useDefault': false,
      'overrides': [
        {'method': 'email', 'minutes': 24 * 60},
        {'method': 'popup', 'minutes': 10},
      ],
    },
  };

  updateGoogEvent(req.params.id, googEvent);
  Event.findOneAndUpdate({_id: req.params.id}, {
    name: name, 
    hostname: hostname, 
    num_employees: num_employees, 
    client: client, 
    start_date: start.toDate(), 
    end_date: end.toDate(), 
    games: games, 
    workers: workers,
    summary: summary,
    location: location,
    description: description,
    start: start.toDate(),
    end: end.toDate(),
  }, function(err, event) {
    if (err) res.send(err);
    res.redirect('/events/' + req.params.id);
  });
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
