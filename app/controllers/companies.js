var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Client = mongoose.model('client'),
  Company = mongoose.model('company'),
  Event = mongoose.model('event');

function authenticate(req, res, next) {
  if (req.method == 'GET' || req.method == 'POST') {
    next();
  } else {
    next();
  }
}

module.exports = function (app) {
  app.use(authenticate);
  app.use('/', router);
};

router.get('/companies', function (req, res, next) {
  Company.find( function (err, companies) {
    if (err) return next(err);
    res.render('Companies/companies', {companies});
  });
});

router.get('/companies/new', function (req, res, next) {
  res.render('Companies/new');
});

