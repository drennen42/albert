// 'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    moment = require('moment');

var EventGameSchema = new Schema({
    game: { type: Schema.Types.ObjectId, ref: 'casinoGame' },
    event: { type: Schema.Types.ObjectId, ref: 'event' },
    dealer: { type: Schema.Types.ObjectId, ref: 'user' }, // Dealer assigned to this specific instance of the game.
    is_open: Boolean,
    pay_rate: Number
});

mongoose.model('eventGame', EventGameSchema);
