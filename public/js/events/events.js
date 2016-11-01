var moment = require('moment'),
	$ = require('jquery');

function giveMeTheDate() {
	var thisDay = {'numeric': moment().format('DD'), 'long': moment().format('DDD')},
		thisMonth = {'numeric': moment().format('MM'), 'long': moment().format('MMMM'), 'short': moment().format('MMM')},
		thisYear = moment().format('YYYY');
	return {'day': thisDay, 'month': thisMonth, 'year': thisYear};
};

// console.log('data game id elements: ', $('[data-game-id]'));


module.exports = {
	giveMeTheDate: giveMeTheDate
};

