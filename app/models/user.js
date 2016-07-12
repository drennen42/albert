// 'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
    is_admin: Boolean,
    username: String,
    first_name: String,
    last_name: String,
    email: String,
    rank: String,
    active: Boolean,
    password: {type: String, required: true, bcrypt: true},
    games: [{ type: Schema.Types.ObjectId, ref: 'casinoGame' }],
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
