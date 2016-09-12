// 'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CompanySchema = new Schema({
    name: {required: [true, 'Company Name is required'], type: String},
    primary_contact: [{ type: Schema.Types.ObjectId, ref: 'user' }],
    secondary_contact: [{ type: Schema.Types.ObjectId, ref: 'user' }],
    notes: String
});

mongoose.model('company', CompanySchema);
