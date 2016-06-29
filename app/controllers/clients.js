var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Client = mongoose.model('client');

module.exports = function (app) {
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
    
  var newClient = new Client({first_name: first_name, last_name: last_name, email: email});
    
  newClient.save(function (err) {
    if (err) {
        console.log('save error', err);
    }

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