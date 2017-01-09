var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Company = mongoose.model('company'),
  Event = mongoose.model('event'),
  User = mongoose.model('user');

function authenticate(req, res, next) {
	if (!!req.session && !!req.session.user && req.session.user.username === 'drennen42') {
	  return next();
	} else {
		console.log('No session user or the user does not have permission to view this page');
		res.status(403).render('index', {
		  title: 'Sheduling Made Easy',
		  err: [{message: 'Unauthorized'}]
		});
	}
}

module.exports = function (app) {
  app.use('/companies', authenticate, router);
};

router.get('/', function (req, res, next) {
    Company.find()
    	.populate('representative')
    	.exec(function (err, companies) {
	      if (err) return next(err);
	      res.render('Companies/companies', {companies});
	    });
});

router.get('/new', function (req, res, next) {
	User.find(function (err, users) {
		if (err) return next(err);
		res.render('Companies/new', {users});
	});
});

router.post('/new', function (req, res, next) {
  //Retrieve data
  var name = req.body.company_name,
  	active = req.body.is_active,
    representative = req.body.representative,
    address_street = req.body.address_street,
    address_city = req.body.address_city,
    address_state = req.body.address_state,
    address_zip = req.body.address_zip,
    billing_street = req.body.billing_street,
    billing_city = req.body.billing_city,
    billing_state = req.body.billing_state,
    billing_zip = req.body.billing_zip;
    
  var newCompany = new Company({
  	active: active,
    name: name, 
    representative: representative,
    address_street: address_street,
    address_state: address_state,
    address_city: address_city,
    address_zip: address_zip,
    billing_state: billing_state, 
    billing_city: billing_city, 
    billing_street: billing_street, 
    billing_zip: billing_zip});

  newCompany.validate(function(err) {
    if (err) {
      console.log('New Company error: ', err);
      res.render('Companies/new', {err: err.errors});
    } else {
      newCompany.save(function (err) {
        if (err) {
          console.log('save error: ', err);
          res.send(err);
        } else {
        	res.redirect('/companies/' + newCompany._id);
        }
      });
    };
  });
});

router.get('/:id', function(req, res, next) {
	Company.findOne({_id: req.params.id})
	.populate('representative')
	.exec(function(err, company) {
    if (err) res.send(err);

    res.render('Companies/show', {company});
  });
});