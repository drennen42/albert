// 'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserEventSchema = new Schema({
	user: { type: Schema.Types.ObjectId, ref: 'user' },
	event: { type: Schema.Types.ObjectId, ref: 'event' },
	calendarEvent: { type: Schema.Types.ObjectId, ref: 'calendarEvent'}
})

mongoose.model('userEvent', UserEventSchema);