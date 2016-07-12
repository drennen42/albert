var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Event = mongoose.model('event'),
  User = mongoose.model('user'),
  CasinoGame = mongoose.model('casinoGame'),
  Client = mongoose.model('client'),
  addGoogEvent = require('../../quickstart.js').addNewEvent,
  updateGoogEvent = require('../../quickstart.js').updateNewEvent,
  moment = require('moment');

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
