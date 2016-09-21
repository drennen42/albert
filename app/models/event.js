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
    hostname: String,
    start_date: Date,
    end_date: Date,
    client: { type: Schema.Types.ObjectId, ref: 'client' },
    games: [{ type: Schema.Types.ObjectId, ref: 'casinoGame' }],
    eventGames: [{ type: Schema.Types.ObjectId, ref: 'eventGame' }],
    workers: [{ type: Schema.Types.ObjectId, ref: 'user' }],
    invited: [{ type: Schema.Types.ObjectId, ref: 'user' }],
    waitlist: [{ type: Schema.Types.ObjectId, ref: 'user' }],
    declined: [{ type: Schema.Types.ObjectId, ref: 'user' }],
    num_employees: Number
});

mongoose.model('event', EventSchema);
