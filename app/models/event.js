// 'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;



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
    num_employees: Number
});


    

mongoose.model('event', EventSchema);
