var $ = require('jquery');
var moment = require('moment');
var totalHours = 0.0;

function init() {
	// var today = new Date(),
	// 	twoWeeksAgo = new Date(),
	var today = moment().startOf('day'),
		twoWeeksAgo = moment(today).subtract(14, 'd'),
		$userEvents = $('[data-js=userEvent]');

	// today.setHours(0,0,0,0);
	// twoWeeksAgo.setHours(0,0,0,0);
	// twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

	console.log('today: ', today);
	console.log('twoWeeksAgo: ', twoWeeksAgo);
	$('[data-js=pay-period-start]').val(twoWeeksAgo.toISOString().slice(0,10));
	$('[data-js=pay-period-end]').val(today.toISOString().slice(0,10));

	$userEvents.sort(function(a, b) {
		var aDate = $(a).children('[data-js=userEvent-start]').attr('data-start-val'),
			bDate = $(b).children('[data-js=userEvent-start]').attr('data-start-val');

		console.log('aDate, bDate: ', [aDate, bDate]);

		if(aDate > bDate) {
			return 1;
		}
		if(aDate < bDate) {
			return -1;
		}
		return 0;
	})

	$userEvents.detach().insertBefore('.timesheet-total-hours-row');
}

function updateTotalHours() {
	$('[data-js=timesheet-total-hours]').text(totalHours);
}

$('[data-js=userEvent-hours-worked]').not('.display-none').each(function (i, eventHours) {
	totalHours = Number(totalHours) + Number($(eventHours).html());
	updateTotalHours();
})

$('[data-js=pay-period-button]').on('click', function(){
	var userId = $(".timesheet-user-info").attr('data-user-id'),
		startDate = new Date($('[data-js=pay-period-start]').val().split(/\-/).join('/')),
		endDate = new Date($('[data-js=pay-period-end]').val().split(/\-/).join('/'));

	startDate.setHours(0,0,0,0);
	endDate.setHours(23,59,59,0);
	$('tr[data-js=userEvent]').each(function(i, userEvent) {
		var eventStart = new Date($(userEvent).find('[data-js=userEvent-start]').html()),
			eventEnd = new Date($(userEvent).find('[data-js=userEvent-end]').html());
			
		if (eventStart >= startDate && eventEnd <= endDate) {
			$(userEvent).removeClass('display-none');
		} else {
			$(userEvent).addClass('display-none');
		}
	});
	totalHours = 0;
	$('[data-js=userEvent-hours-worked]').each(function (i, eventHours) {
		if (!$(eventHours).parent('[data-js=userEvent]').hasClass('display-none')){
			totalHours = Number(totalHours) + Number($(eventHours).html());
		}
		updateTotalHours();
	})
});

init();
