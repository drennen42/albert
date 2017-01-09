var express = require('express');
var session = require('express-session');
var glob = require('glob');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compress = require('compression');
var methodOverride = require('method-override');
var exphbs  = require('express-handlebars');
var helpers = require('handlebars-helpers')();

module.exports = function(app, config) {
  var env = process.env.NODE_ENV || 'development';
  app.locals.ENV = env;
  app.locals.ENV_DEVELOPMENT = env == 'development';
  
  app.engine('handlebars', exphbs({
    layoutsDir: config.root + '/public/views/layouts/',
    defaultLayout: 'main',
    partialsDir: config.root + '/public/views/partials/'
  }));
  app.set('views', config.root + '/public/views');
  app.set('view engine', 'handlebars');


  // app.use(favicon(config.root + '/public/img/favicon.ico'));
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(cookieParser());
  app.use(compress());
  app.use(express.static(config.root + '/public'));
  app.use(methodOverride());

  if (app.get('env') === 'production') {
    app.set('trust proxy', 1) // trust first proxy
    app.use(session({
      resave: true,
      saveUninitialized: true,
      secret: 'I will never tell!',
      // cookie: {
      //   httpOnly: true,
      //   secure: true
      // }
    }));


    // sess.cookie.secure = true // serve secure cookies
  } else {
    app.use(session({
      resave: false,
      saveUninitialized: false,
      secret: 'I will never tell!'
    }));
  };

  // Session-persisted message middleware

  app.use(function(req, res, next){
    var err = req.session.error;
    var msg = req.session.success;
    delete req.session.error;
    delete req.session.success;
    res.locals.message = '';
    if (err) res.locals.message = err;
    if (msg) res.locals.message = msg;
    next();
  });

  function getSessUser(req, res, next) {
    if (req.method === 'GET' || req.method == 'POST') { 
      if (req.session.user) {
        app.locals.SESS_USER = req.session.user;
        next();
      } else {
        app.locals.SESS_USER = '';
        console.log('no session user');
        next();
      };
    };
  };

  app.use(getSessUser);

  var controllers = glob.sync(config.root + '/app/controllers/*.js');
  controllers.forEach(function (controller) {
    require(controller)(app);
  });

  app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
  
  if(app.get('env') === 'development'){
    app.use(function (err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err,
        title: 'error'
      });
    });
  };

  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: {},
        title: 'error'
      });
  });

};
