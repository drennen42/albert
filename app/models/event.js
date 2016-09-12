// 'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    moment = require('moment');



var EventSchema = new Schema({
    name: String,
    summary: String,
    location: String,
    description: String,
    start: Date,
    end: Date,
    attendees: [{ type: Schema.Types.ObjectId, ref: 'user' }],
    // reminders: {
    //     useDefault: false,
    //     overrides: [
    //         {method: 'email', minutes: 24 * 60},
    //         {method: 'popup', minutes: 10},
    //     ],
    // },
    hostname: String,
    start_date: Date,
    end_date: Date,
    client: { type: Schema.Types.ObjectId, ref: 'client' },
    games: [{ type: Schema.Types.ObjectId, ref: 'casinoGame' }],
    workers: [{ type: Schema.Types.ObjectId, ref: 'user' }],
    goog_event_id: String,
    invited: [{ type: Schema.Types.ObjectId, ref: 'user' }],
    waitlist: [{ type: Schema.Types.ObjectId, ref: 'user' }],
    declined: [{ type: Schema.Types.ObjectId, ref: 'user' }],
    num_employees: Number
});

EventSchema.methods.start_date_val = function start_date_val (cb) {
    // console.log('this event.start: ', this.event.start);
    var dateToReturn = this.event.start_date;
    // console.log('dateToReturn: ', dateToReturn);
    // console.log('this.start_date: ', this.event);
    return dateToReturn.valueOf();
};
  
EventSchema.methods.start_date_moment = function start_date_moment (cb) {
    return moment(this.event.start_date).format('ddd, MMM Do, YYYY');
};

EventSchema.methods.end_date_moment = function end_date_moment (cb) {
    return moment(this.event.end_date).format('ddd, MMM Do, YYYY');
};


mongoose.model('event', EventSchema);
