var $ = require('jquery');
window.jQuery = window.$ = $;
require('bootstrap');
var chosen = require('../../middleware/chosen.jquery.min.js');
$('.chosen-select').chosen({allow_single_deselect: true});