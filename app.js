

var express = require('express'),
  config = require('./config/config'),
  glob = require('glob'),
  mongoose = require('mongoose');


mongoose.connect(config.db);
var db = mongoose.connection;
db.on('error', function () {
  throw new Error('unable to connect to database at ' + config.db);
});

var models = glob.sync(config.root + '/app/models/*.js');
models.forEach(function (model) {
  require(model);
});
var app = express();

require('./config/express')(app, config);

app.listen(config.port, '0.0.0.0', function () {
  console.log('Express server listening on port ' + config.port);
});


	// Nodemailer setup
	

	// send mail with defined transport object
	// $('[data-js~="send-email-btn"]').on('click', function(evt) {
	// 	console.log('******** clicked the send email button!!!!!!!!!!');
	// 	transporter.sendMail(mailOptions, function(error, info){
	// 	    if(error){
	// 	        return console.log(error);
	// 	    }
	// 	    console.log('Message sent: ' + info.response);
	// 	});
	// });