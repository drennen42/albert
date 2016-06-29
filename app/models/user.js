// 'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/*
	Users will have:
	1. first_name
    2. last_name
    3. phone_num
*/


var UserSchema = new Schema({
    username: String,
    first_name: String,
    last_name: String,
    email: String,
    password: {type: String, required: true, bcrypt: true},
    phone: {
        type: String,
        validate: {
            validator: function(v) {
                return /\d{3}-\d{3}-\d{4}/.test(v);
            },
            message: '{VALUE} is not a valid phone number!'
        },
        required: [false, 'User phone number not required']
    }
});

UserSchema.plugin(require('mongoose-bcrypt'));

mongoose.model('user', UserSchema);
