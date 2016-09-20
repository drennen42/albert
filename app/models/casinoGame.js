// 'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var CasinoGameSchema = new Schema({
    name: String
});

mongoose.model('casinoGame', CasinoGameSchema);
