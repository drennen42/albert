// 'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var ClientSchema = new Schema({
    first_name: String,
    last_name: String,
    email: String
});

    

mongoose.model('client', ClientSchema);
