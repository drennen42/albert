// 'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CompanySchema = new Schema({
    name: String,
    address_street: String,
    address_city: String,
    address_state: String,
    address_zip: {
        type: Number,
        required: [false, 'Company zip code not required'],
        validate: {
            validator: function(v) {
                return /(\d{5}|\D{0,1})/.test(v);
            },
            message: 'Address Zip: {VALUE} is not a valid zip code!'
        }
    },
    billing_street: String,
    billing_city: String,
    billing_state: String,
    billing_zip: {
        type: Number,
        validate: {
            validator: function(v) {
                return /(\d{5}|\D{0,1})/.test(v);
            },
            message: 'Billing Zip: {VALUE} is not a valid zip code!'
        },
        required: [false, 'Company billing zip code not required']
    },
    active: Boolean,
    events: [{ type: Schema.Types.ObjectId, ref: 'event'}],
    representative: { type: Schema.Types.ObjectId, ref: 'user'},
    users_pending: [{ type: Schema.Types.ObjectId, ref: 'user'}],
    users: [{ type: Schema.Types.ObjectId, ref: 'user'}]
});

mongoose.model('company', CompanySchema);
