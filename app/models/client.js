// 'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var ClientSchema = new Schema({
    first_name: String,
    last_name: String,
    full_name: String,
    email: String
});

    
// function getFullName(first, last) {
// 	console.log('@@@@@@@@@ client full name: ', `${first} ${last}`);
// 	return `${first} ${last}`;
// };

mongoose.model('client', ClientSchema);
