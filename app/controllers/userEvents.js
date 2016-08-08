var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  User = mongoose.model('user'),
  Event = mongoose.model('event'),
  UserEvent = mongoose.model('userEvent');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/users/:id/events', function(req, res, next) {
  var events = [];

  User.findOne({_id: req.params.id}, function(err, user) {
    if (err) res.send(err);
    UserEvent.find({user: user})
      .populate('event')
      .exec(function(err, userEvents){
        if (err) res.send(err);
        console.log('userEvents: ', userEvents);
        console.log('userEvents.hours_worked: ', userEvents.hours_worked);
        res.render('Events/events', {events: userEvents});
      // for (var i = 0; i < userEvents.length; i++) {
      //   UserEvent.findOne(userEvents[i])
      //     .populate('event');
      //   events.push(userEvents[i].event);
      // };
    });

      // Event.findById(user.events[i], function(err, event) {
      //   if (err) return next(err);
      //   events.push(event);
      // });
  // };

    // res.render('Events/events', {events});
  });
});