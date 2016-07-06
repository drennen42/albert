var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Client = mongoose.model('client'),
  Event = mongoose.model('event');

function authenticate(req, res, next) {
  if (req.method == 'GET' || req.method == 'POST') {
    console.log('session user: ', req.session.user);
    next();
  } else {
    console.log('request is not a GET nor a POST... ? What?');
    next();
  }
}

module.exports = function (app) {
  app.use(authenticate);
  app.use('/', router);
};

router.get('/clients', function (req, res, next) {
  Client.find( function (err, clients) {
    if (err) return next(err);
    res.render('Clients/clients', {clients});
  });
});

router.get('/clients/new', function (req, res, next) {
  res.render('Clients/new');
});

router.post('/clients/new', function (req, res, next) {
  //Retrieve data
  var first_name = req.body.first_name,
    last_name = req.body.last_name,
    email = req.body.email;
    
  var newClient = new Client({first_name: first_name, last_name: last_name, email: email, full_name: first_name + ' ' + last_name});
    
  newClient.save(function (err, newGuy) {
    if (err) {
        console.log('save error', err);
    }
    // console.log('CLIENT SAVE newGuy: ', [newGuy, first_name, last_name]);
    // newGuy.update({full_name: first_name + ' ' + last_name});
    res.redirect('/clients/' + newClient._id);
  });
});

router.get('/clients/:id', function(req, res, next) {
  Client.findOne({_id: req.params.id}, function(err, client) {
    if (err)
      res.send(err);

    res.render('Clients/show', {client});
  });
});

router.post('/clients/:id', function (req, res, next) {

  Client.findByIdAndRemove(req.params.id, function(err, client) {
    if (err)
      res.send(err);

  });
    
  res.redirect('/clients');
});

router.get('/clients/:id/events', function(req, res, next) {
  Client.findOne({_id: req.params.id}, function(err, client) {
    if (err)
      res.send(err);
    Event.find({client: req.params.id})
      .populate('client')
      .populate('games')
      .populate('workers')
      .exec(function (err, events) {
        if (err)
          res.send(err)
        console.log('******** events: ', events);
        res.render('Events/events', {events});
      })
  });
});