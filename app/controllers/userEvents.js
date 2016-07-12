var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  User = mongoose.model('user'),
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