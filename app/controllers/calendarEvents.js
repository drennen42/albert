var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  $ = require('jquery'),
  Event = mongoose.model('event'),
  User = mongoose.model('user'),
  CasinoGame = mongoose.model('casinoGame'),
  Client = mongoose.model('client'),
  CalendarEvent = mongoose.model('calendarEvent'),
  listCalEvents = require('../../quickstart.js').listEvents;

module.exports = function (app) {
  app.use('/calendar', router);
};

// router.get('/calendar', function(req,res,next) {
// 	listCalEvents();
//   Event.find( function (err, events) {
//     if (err) return next(err);
//     res.render('Events/calendar', {events});
//   });
// });


router.get('/', function(req, res, next) {
  Event.find( function (err, events) {
    if (err) return next(err);
    console.log('__dirname: ', __dirname);
    res.render('Events/calendar', {events});
  });
})