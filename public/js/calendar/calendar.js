var $ = require('jquery'),
	moment = require('moment'),
	daySpaces = {'Sun': 0, 'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6};

module.exports = function(data) {
	var startDate = moment();

	function createFirstWeek(spaceNeeded) {
		var html = '';
		// start the row
		html += '<tr class="week">';

		// create blank days in a loop until reach spaceNeeded
		for (var i = 0; i < Number(spaceNeeded); i++) {
			html += '<td class="day">-</td>';
		};

		// create days in a loop until loop iterator + space needed == 7
		for (var i = 0; (i + 1 + Number(spaceNeeded)) <= 7; i++) {
			html += `<td class="day" data-js-iso="${moment(data.startDate).add(i, 'd').format('YYYY-MM-DD')}">${moment(data.startDate).add(i, 'd').format('DD')}</td>`;
		};
		
		// close row
		html += '</tr>';

		// console.log('create first week html: ', html);
		return html;
	};

	function createWeek(weekNum, startDay) {
		var html = '';

		// start row
		html += `<tr class="week week-${weekNum}">`;

		// create 7 days in a loop using startDay
		for (var i = 0; i < 7; i++) {
			html += `<td class="day" data-js-iso="${moment(startDay).add(i, 'd').format('YYYY-MM-DD')}">${moment(startDay).add(i, 'd').format('DD')}</td>`
		};

		html += '</tr>';

		// console.log('create week html: ', html);
		return html;
	};

	function createMonth() {
		var spaceNeeded = data.startDate.weekday(),
			html = '',
			nextWeekStartDay = moment(data.startDate).add((7 - spaceNeeded), 'd');

		html += createFirstWeek(spaceNeeded);

		for (var i = 0; i < 4; i++) {
			html += createWeek(i, nextWeekStartDay);
			nextWeekStartDay.add(7, 'd');
		}
		// console.log('HTML: ', html);
		return html;
	};

	// var $calendar = $('.calendar');
	// console.log('$calendar: ', $calendar);
	return createMonth();
};