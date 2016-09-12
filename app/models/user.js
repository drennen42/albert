// 'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
    is_admin: Boolean,
    is_logged_in: Boolean,
    username: {type: String, required: true, unique: true},
    first_name: String,
    last_name: String,
    hourly_rate: Number,
    email: String,
    rank: String,
    confirmed: Boolean,
    active: Boolean,
    password: {type: String, required: true, bcrypt: true},
    games: [{ type: Schema.Types.ObjectId, ref: 'casinoGame' }],
    events: [{ type: Schema.Types.ObjectId, ref: 'event'}],
    phone: {
        type: String,
        unique: true,
        validate: {
            validator: function(v) {
                return /\d{3}-\d{3}-\d{4}/.test(v) || /\d{10}/.test(v) || /\D{0,1}/;
            },
            message: '{VALUE} is not a valid phone number!'
        },
        required: [false, 'User phone number not required']
    }
});

UserSchema.plugin(require('mongoose-bcrypt'));

mongoose.model('user', UserSchema);
