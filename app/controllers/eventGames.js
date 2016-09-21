var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Event = mongoose.model('event'),
  User = mongoose.model('user'),
  CasinoGame = mongoose.model('casinoGame'),
  EventGame = mongoose.model('eventGame');

module.exports = function (app) {
  app.use('/eventGame', router);
};

// TODO: Add routes for eventGames