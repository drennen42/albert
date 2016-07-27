var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Event = mongoose.model('event'),
  User = mongoose.model('user'),
  UserEvent = mongoose.model('userEvent'),
  CasinoGame = mongoose.model('casinoGame'),
  moment = require('moment');

module.exports = function (app) {
  app.use('/', router);
};