var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Event = mongoose.model('event'),
  User = mongoose.model('user'),
  UserEvent = mongoose.model('userEvent'),
  CasinoGame = mongoose.model('casinoGame'),
  PayPeriod = mongoose.model('payPeriod'),
  moment = require('moment');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/users/:id/timesheet', function(req, res, next) {
	User.findOne({_id: req.params.id}, function(err, user) {
		if (err) res.send(err);
		UserEvent.find({user: user})
		 .populate('event')
		 .populate('user')
		 .exec(function(err, userEvents) {
			if (err) res.send(err);
			userEvents.start = moment(userEvents.start).format('MM-DD-YYYY');
			userEvents.end = moment(userEvents.end).format('MM-DD-YYYY');
			res.render('Timesheets/show', {userEvents: userEvents, user: user});
		 });
	});
});

// router.post('/users/:id/timesheet', function(req, res, next) {
// 	// console.log('request body: ', req.body);
// 	User.findOne({_id: req.params.id}, function(err, user) {
// 		if (err) res.send(err);
// 		var sDate = new Date(req.body.startDate.split(/\-/).join('/')).valueOf(),
// 			eDate = new Date(req.body.endDate.split(/\-/).join('/')).valueOf();
// 		UserEvent.find({user: user, $where: function(sDate, eDate) {
// 			return this.start_date_val() >= sDate && this.end_date_val() <= eDate;
// 		}})
// 		 // .where('start_date_val()').gte(new Date(req.body.startDate.split(/\-/).join('/')).valueOf())
// 		 // .where('end_date_val()').lte(new Date(req.body.endDate.split(/\-/).join('/')).valueOf())
// 		 .populate('event')
// 		 .populate('user')
// 		 .exec(function(err, userEvents) {
// 			if (err) res.send(err);
// 			// console.log('userEvents: ', userEvents);
// 			// console.log('userEvents.start_date_val: ', userEvents.start_date_val);
// 			// userEvents.start = moment(userEvents.start).format('MM-DD-YYYY');
// 			// userEvents.end = moment(userEvents.end).format('MM-DD-YYYY');
// 			// console.log('response: ', {userEvents: userEvents, user: user});
// 			res.send({userEvents: userEvents, user: user});
// 		 });
// 	});
// });