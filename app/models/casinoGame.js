// 'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var CasinoGameSchema = new Schema({
    name: String
});

// Handlebars.registerHelper('list', function(items, options) {
//   var out = "<ul>";

//   for(var i=0, l=items.length; i<l; i++) {
//     out = out + "<li>" + options.fn(items[i]) + "</li>";
//   }

//   return out + "</ul>";
// });

// Handlebars.registerHelper('dataName', function(thisName, options) {
// 	return thisName.split(' ').join('');
// });

mongoose.model('casinoGame', CasinoGameSchema);
