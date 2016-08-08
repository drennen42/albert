// 'use strict';

var mongoose = require('mongoose'),
	moment = require('moment'),
    Schema = mongoose.Schema;

var PayPeriodSchema = new Schema({
	num_weeks: Number,
    start_date: Date,
    events: [{ type: Schema.Types.ObjectId, ref: 'event' }]
});

PayPeriodSchema.methods.end_date = function end_date (cb) {
	var start = moment(start_date);

    return moment(start.add(num_weeks, 'w')).toDate();
};

mongoose.model('payPeriod', PayPeriodSchema);
