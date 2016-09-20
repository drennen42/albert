// 'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    moment = require('moment');

var EventGameSchema = new Schema({
    amount: Number,
    game: [{ type: Schema.Types.ObjectId, ref: 'casinoGame' }],
    event: [{ type: Schema.Types.ObjectId, ref: 'event' }],
    dealer: [{ type: Schema.Types.ObjectId, ref: 'user' }]
});

mongoose.model('eventGame', EventGameSchema);
