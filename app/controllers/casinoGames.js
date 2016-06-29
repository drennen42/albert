var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  CasinoGame = mongoose.model('casinoGame');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/casinoGames', function (req, res, next) {
  CasinoGame.find( function (err, casinoGames) {
    if (err) return next(err);
    res.render('CasinoGames/casinoGames', {casinoGames});
  });
});

router.get('/casinoGames/new', function (req, res, next) {
  res.render('CasinoGames/new');
});

router.post('/casinoGames/new', function (req, res, next) {
  //Retrieve data
  var name = req.body.name && req.body.name.trim();
    
  var newCasinoGame = new CasinoGame({name: name});
    
  newCasinoGame.save(function (err) {
    if (err) {
        console.log('save error', err);
    }

    res.redirect('/casinoGames/' + newCasinoGame.name);
  });
});

router.get('/casinoGames/:name', function(req, res, next) {
  CasinoGame.findOne({name: req.params.name}, function(err, casinoGame) {
    if (err)
      res.send(err);

    res.render('CasinoGames/show', {casinoGame});
  });
});

router.post('/casinoGames/:id', function (req, res, next) {

  CasinoGame.findByIdAndRemove(req.params.id, function(err, casinoGame) {
    if (err)
      res.send(err);

  });
    
  res.redirect('/casinoGames');
});