// 'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    // ObjectId = mongoose.Schema.ObjectId,
    // ClientSchema = mongoose.model('client').schema;

/*
	Events will have:
	1. name
	2. start date
	3. end date
	4. Address 
	5. Client
	6. attendance
	7. Game(s) *
	8. Employee(s) * (or number of employees)
	9. price_quote
*/


var EventSchema = new Schema({
    name: String,
    hostname: String,
    client: { type: Schema.Types.ObjectId, ref: 'client' },
    games: [{ type: Schema.Types.ObjectId, ref: 'casinoGame' }],
    workers: [{ type: Schema.Types.ObjectId, ref: 'user' }],
    // start_date: Date,
    // end_date: Date,
    // street_address: String,
    // city: String,
    // state: String,
    // zip_code: Number,
    // host: String,
    // price_quote: Number,
    num_employees: Number
});

    

mongoose.model('event', EventSchema);
