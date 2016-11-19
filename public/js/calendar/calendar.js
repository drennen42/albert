var $ = require('jquery'),
	moment = require('moment'),
	daySpaces = {'Sun': 0, 'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6};

module.exports = function(data) {
	var startDate = moment();

	function createFirstWeek(spaceNeeded) {
		var html = '';

		html += '<tr class="week">';

		for (var i = 0; i < Number(spaceNeeded); i++) {
			html += '<td class="day">-</td>';
		};

		for (var i = 0; (i + 1 + Number(spaceNeeded)) <= 7; i++) {
			html += `<td class="day" data-js-iso="${moment(data.startDate).add(i, 'd').format('YYYY-MM-DD')}">${moment(data.startDate).add(i, 'd').format('DD')}</td>`;
		};
		
		html += '</tr>';
		return html;
	};

	function createWeek(weekNum, startDay, monthEvents) {
		var html = '';

		html += `<tr class="week week-${weekNum}">`;

		for (var i = 0; i < 7; i++) {
			if (Object.keys(monthEvents).length > 0) {
				// console.log('There are events this month');
				if (!!monthEvents[moment(startDay).add(i, 'd').format('D')]) {
					// console.log('This day has an event!: ', monthEvents[moment(startDay).add(i, 'd').format('D')]);
					html += `<td class="day" data-js-iso="${moment(startDay).add(i, 'd').format('YYYY-MM-DD')}">
								<div class="row container m0">
								<div class="row">
									<div class="col-xs-4 cal-day-num">
										${moment(startDay).add(i, 'd').format('DD')}
									</div>`;

					if (!!data.user) {
						for (var x = 0; x < monthEvents[moment(startDay).add(i, 'd').format('D')].length; x++) {
							html += `<div class="col-xs-12 day-event">
										<div>
											<a href="/events/${monthEvents[moment(startDay).add(i, 'd').format('D')][x]._id}">
												${moment(monthEvents[moment(startDay).add(i, 'd').format('D')][x].start_date).format('ha')} ${monthEvents[moment(startDay).add(i, 'd').format('D')][x].name}
											</a>
											<button type="button"><a href="/events/${monthEvents[moment(startDay).add(i, 'd').format('D')][x]._id}/addToWaitlist/${data.user._id}">+</button>
										</div>
									</div>`;
						};
					} else {
						for (var x = 0; x < monthEvents[moment(startDay).add(i, 'd').format('D')].length; x++) {
							html += `<div class="col-xs-12 day-event">
										<div><a href="/events/${monthEvents[moment(startDay).add(i, 'd').format('D')][x]._id}">
											${moment(monthEvents[moment(startDay).add(i, 'd').format('D')][x].start_date).format('ha')} ${monthEvents[moment(startDay).add(i, 'd').format('D')][x].name}
										</a>
										</div>
									</div>`;
						};
					}

					html += `</div></div></td>`;
				} else {
					// console.log('No events this day!: ', moment(startDay).add(i, 'd').format('YYYY-MM-DD'));
					html += `<td class="day" data-js-iso="${moment(startDay).add(i, 'd').format('YYYY-MM-DD')}">
								<div class="row container m0">
									<div class="row">
										<div class="col-xs-4 cal-day-num">
											${moment(startDay).add(i, 'd').format('DD')}
										</div>
									</div>
								</div>
							</td>`;
				};
			} else {
				// console.log('No events this month!');
				html += `<td class="day" data-js-iso="${moment(startDay).add(i, 'd').format('YYYY-MM-DD')}">
							<div class-"row container m0">
								<div class="row">
									<div class="col-xs-4 cal-day-num">
										${moment(startDay).add(i, 'd').format('DD')}
									</div>
								</div>
							</div>
						</td>`;
			};
		};

		html += '</tr>';
		return html;
	};

	function createMonth() {
		var spaceNeeded = data.startDate.weekday(),
			html = '',
			nextWeekStartDay = moment(data.startDate).add((7 - spaceNeeded), 'd'),
			monthEvents = {};

		data.events.map((evt) => {
			if (!!monthEvents[Number(moment(evt.start_date).date())]) {
				monthEvents[Number(moment(evt.start_date).date())].push(evt);
			} else {
				monthEvents[Number(moment(evt.start_date).date())] = [evt];
			}
		});

		// console.log('monthEvents: ', monthEvents);

		html += createFirstWeek(spaceNeeded);

		for (var i = 0; i < 4; i++) {
			html += createWeek(i, nextWeekStartDay, monthEvents);
			nextWeekStartDay.add(7, 'd');
		}
		return html;
	};

	return createMonth();
};