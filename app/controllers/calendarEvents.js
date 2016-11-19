var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  moment = require('moment'),
  Event = mongoose.model('event'),
  User = mongoose.model('user'),
  CasinoGame = mongoose.model('casinoGame'),
  Client = mongoose.model('client'),
  CalendarEvent = mongoose.model('calendarEvent'),
  Calendar = require('../../public/js/calendar/calendar.js'),
  theDate = require('../../public/js/events/events.js').giveMeTheDate();

module.exports = function (app) {
  app.use('/calendar', router);
};

router.get('/', function(req, res, next) {
  var activeMonth = moment().startOf('month'),
      thisMonth = activeMonth.format('MM'),
      thisYear = activeMonth.format('YYYY');

  res.redirect('/calendar/' + thisYear + '/' + thisMonth);
});

router.get('/:year/:month', function(req, res, next) {

  var activeMonth = new Date(`${req.params.year}-${req.params.month}-15`).toISOString(),
      activeMonthMoment = moment(activeMonth),
      activeMonthStartDate = moment(activeMonthMoment).startOf('month').toDate(),
      activeMonthEndDate = moment(activeMonthMoment).endOf('month').toDate(),
      thisMonth = moment(activeMonthMoment).format('MMMM'),
      thisYear = moment(activeMonthMoment).format('YYYY'),
      lastMonth = moment(activeMonth).subtract(1, 'month'),
      lastMonthYear = lastMonth.year(),
      nextMonth = moment(activeMonth).add(1, 'month'),
      nextMonthYear = nextMonth.year(),
      dateObj = {'thisMonth': thisMonth, 'thisYear': thisYear, 'lastMonth': lastMonth.format('MM'), 'lastMonthYear': lastMonthYear, 'nextMonth': nextMonth.format('MM'), 'nextMonthYear': nextMonthYear},
      calendarHtml;

  Event.find()
    .where('start_date').gte(activeMonthStartDate.toISOString()).lte(activeMonthEndDate.toISOString())
    .sort({'start_date': 'descending'})
    .exec(function (err, events) {
    if (err) res.send(err);
    // console.log('__dirname: ', __dirname);
    // console.log('events: ', events);
    calendarHtml = Calendar({'startDate': moment(activeMonthMoment).startOf('month'), 'events': events, 'user': req.session.user});
    res.render('Events/calendar', {events, activeMonth: activeMonthMoment.format('MMMM YYYY'), dateObj, calendarHtml: calendarHtml});
  });
});