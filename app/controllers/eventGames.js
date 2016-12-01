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

router.post('/:id/addDealer', function (req, res, next) {
	EventGame.findById(req.params.id)
	.populate('event')
	.populate('dealer')
	.exec(function (err, evtGame) {
		if (err) res.send(err);
		
		User.findById(req.body.dealer, function(err, user) {
			if (err) res.send(err);
			evtGame.dealer = user;
			evtGame.is_open = false;
			evtGame.event.waitlist.pop(user);
			evtGame.event.save((err) => {if (err) res.send(err);});
			evtGame.save(function(err){
	          if (err) res.send(err);
	        });
		});
		res.redirect('/events/' + evtGame.event._id + '/games');
	});
});

router.post('/:id/deleteDealer', function(req, res, next) {
	EventGame.findById(req.params.id)
	.populate('event')
	.populate('dealer')
	.exec(function (err, evtGame) {
		if (err) res.send(err);
		
		User.findOne({_id: req.body.deleteDealer}, function(err, user) {
			console.log('Dealer to be deleted: ', user);
			if (err) res.send(err);
			evtGame.dealer = null;
			evtGame.is_open = true;
			evtGame.event.waitlist.push(user);
			evtGame.event.save((err) => {if (err) res.send(err);});
			evtGame.save(function(err){
	          if (err) res.send(err);
	        });
		});
		res.redirect('/events/' + evtGame.event._id + '/games');
	});
});