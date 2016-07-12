// 'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var ClientSchema = new Schema({
    first_name: {required: [true, 'First Name is required'], type: String},
    last_name: String,
    full_name: String,
    email: String,
    primary_contact_phone: {
        type: String,
        validate: {
            validator: function(v) {
                return /\d{3}-\d{3}-\d{4}/.test(v) || /\D{0,1}/.test(v);
            },
            message: '{VALUE} is not a valid phone number!'
        },
        required: [false, 'Client phone number is required']
    },
    day_of_phone: {
        type: String,
        required: [false, 'Client phone number not required'],
        validate: {
            validator: function(v) {
                return /\d{3}-\d{3}-\d{4}/.test(v) || /\D{0,1}/.test(v);
            },
            message: '{VALUE} is not a valid phone number!'
        }
    },
    address_street: String,
    address_city: String,
    address_state: String,
    // address_zip: Number,
    address_zip: {
        type: Number,
        required: [false, 'Client zip code not required'],
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
    // billing_zip: Number,
    billing_zip: {
        type: Number,
        validate: {
            validator: function(v) {
                return /(\d{5}|\D{0,1})/.test(v);
            },
            message: 'Billing Zip: {VALUE} is not a valid zip code!'
        },
        required: [false, 'Client billing zip code not required']
    },
    company: String
});


mongoose.model('client', ClientSchema);
