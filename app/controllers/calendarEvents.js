var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  moment = require('moment'),
  Event = mongoose.model('event'),
  User = mongoose.model('user'),
  CasinoGame = mongoose.model('casinoGame'),
  Client = mongoose.model('client'),
  CalendarEvent = mongoose.model('calendarEvent'),
  theDate = require('../../public/js/events/events.js').giveMeTheDate();

module.exports = function (app) {
  app.use('/calendar', router);
};

router.get('/', function(req, res, next) {
  console.log('theDate INSIDE: ', theDate);
  Event.find()
    .sort({'start_date': 'descending'})
    .exec(function (err, events) {
    if (err) res.send(err);
    console.log('__dirname: ', __dirname);
    res.render('Events/calendar', {events});
  });
});