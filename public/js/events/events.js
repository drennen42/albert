var moment = require('moment');

function giveMeTheDate() {
	var thisDay = moment().format('DD'),
		thisMonth = moment().format('MM'),
		thisYear = moment().format('YYYY');
	return thisDay;
};

module.exports = {
	giveMeTheDate: giveMeTheDate
};