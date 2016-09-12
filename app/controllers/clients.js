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
  app.use('/clients', router);
};

router.get('/', function (req, res, next) {
  Client.find( function (err, clients) {
    if (err) return next(err);
    res.render('Clients/clients', {clients});
  });
});

router.get('/new', function (req, res, next) {
  res.render('Clients/new');
});

router.post('/new', function (req, res, next) {
  //Retrieve data
  var first_name = req.body.first_name,
    last_name = req.body.last_name,
    email = req.body.email,
    primary_contact_phone = req.body.primary_contact_phone,
    day_of_phone = req.body.day_of_phone,
    address_street = req.body.address_street,
    address_city = req.body.address_city,
    address_state = req.body.address_state,
    address_zip = req.body.address_zip,
    billing_street = req.body.billing_street,
    billing_city = req.body.billing_city,
    billing_state = req.body.billing_state,
    billing_zip = req.body.billing_zip,
    company = req.body.company;
    
  var newClient = new Client({
    company: company, 
    primary_contact_phone: primary_contact_phone, 
    day_of_phone: day_of_phone, 
    address_street: address_street,
    address_state: address_state,
    address_city: address_city,
    address_zip: address_zip,
    billing_state: billing_state, 
    billing_city: billing_city, 
    billing_street: billing_street, 
    billing_zip: billing_zip,
    first_name: first_name, 
    last_name: last_name, 
    email: email, 
    full_name: first_name + ' ' + last_name});

  newClient.validate(function(err) {
    if (err) {
      res.render('Clients/new', {err: err.errors});
    } else {
      newClient.save(function (err) {
        if (err) 
          console.log('save error: ', err);

        res.redirect('/' + newClient._id);
      });
    };
  });  
});

router.get('/:id', function(req, res, next) {
  Client.findOne({_id: req.params.id}, function(err, client) {
    if (err) res.send(err);

    res.render('Clients/show', {client});
  });
});

router.post('/:id', function (req, res, next) {

  Client.findByIdAndRemove(req.params.id, function(err, client) {
    if (err)
      res.send(err);

  });
    
  res.redirect('/');
});

router.get('/:id/events', function(req, res, next) {
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