// 'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var CasinoGameSchema = new Schema({
    name: String,
    dealers: [{ type: Schema.Types.ObjectId, ref: 'user' }] // People who can deal this game
});

mongoose.model('casinoGame', CasinoGameSchema);
