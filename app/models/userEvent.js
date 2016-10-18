// 'use strict';

var mongoose = require('mongoose'),
	moment = require('moment'),
    Schema = mongoose.Schema;

var UserEventSchema = new Schema({
	user: { type: Schema.Types.ObjectId, ref: 'user' },
	event: { type: Schema.Types.ObjectId, ref: 'event' },
	eventGame: { type: Schema.Types.ObjectId, ref: 'eventGame' },
	calendarEvent: { type: Schema.Types.ObjectId, ref: 'calendarEvent'},
	waitlist: Boolean,
	confirmed: Boolean,
	hourly_rate: Number,
	invited: Boolean
});

UserEventSchema.methods.hours_worked = function hours_worked (cb) {
	var difference = this.event.end.getTime() - this.event.start.getTime(),
		hours = Math.floor(difference / 36e5),
    	minutes = Math.floor(difference % 36e5 / 60000),
    	seconds = Math.floor(difference % 60000 / 1000);

    // return `${hours} hours, ${minutes} minutes`;
    return (hours * 60 + minutes) / 60;
};

UserEventSchema.methods.start_date_val = function start_date_val (cb) {
	// console.log('this event.start: ', this.event.start);
    return Number(this.event.start.valueOf());
};

UserEventSchema.methods.end_date_val = function end_date_val (cb) {
    return Number(this.event.end.valueOf());
};


mongoose.model('userEvent', UserEventSchema);