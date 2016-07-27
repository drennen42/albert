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

router.get('/users/:id/timesheet', function(req, res, next) {
	User.findOne({_id: req.params.id}, function(err, user) {
		if (err) res.send(err);
		UserEvent.find({user: user})
		 .populate('event')
		 .populate('user')
		 .exec(function(err, userEvents) {
			if (err) res.send(err);
			// console.log('userEvents: ', userEvents);
			// console.log('user: ', user);
			userEvents.start = moment(userEvents.start).format('MM-DD-YYYY');
			userEvents.end = moment(userEvents.end).format('MM-DD-YYYY');
			console.log('userEvents.start: ', userEvents.start);
			res.render('Timesheets/show', {userEvents: userEvents, user: user});
		 });
	});
});
		