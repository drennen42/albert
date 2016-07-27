// 'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TimesheetSchema = new Schema({
    name: String,
    start: Date,
    end: Date,
    start_date: Date,
    end_date: Date,
    games: [{ type: Schema.Types.ObjectId, ref: 'casinoGame' }],
    user: [{ type: Schema.Types.ObjectId, ref: 'user' }],
    events: [{ type: Schema.Types.ObjectId, ref: 'userEvent' }]
});


mongoose.model('timesheet', TimesheetSchema);
