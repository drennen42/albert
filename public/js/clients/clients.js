var states = [' ', 'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY', 'AB', 'BC', 'MB', 'NB', 'NL', 'NT', 'NS', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT'];

$(document).ready(function(){
	console.log('billing same checkbox: ', $('#billing-address-same-input'));
	$('#billing-address-same-input').on('change', billingSameCheckboxHandler);
	$.each(states, function(i, state) {
		$('select#address-state-input, select#billing-state-input').append($(`<option value=${state}>${state}</option>`));
	});
});

function billingSameCheckboxHandler() {
	if ($('#billing-address-same-input')[0].checked) {
		$('#billing-street-input').val($('#address-street-input').val());
		$('#billing-city-input').val($('#address-city-input').val());
		$('#billing-state-input').val($('#address-state-input').val());
		$('#billing-zip-input').val($('#address-zip-input').val());

		$('#billing-street-input').attr('disabled', 'disabled');
		$('#billing-city-input').attr('disabled', 'disabled');
		$('#billing-state-input').attr('disabled', 'disabled');
		$('#billing-zip-input').attr('disabled', 'disabled');
	} else {
		$('#billing-street-input').val(($('#billing-street-input').val() == $('#address-street-input').val()) ? '' : $('#billing-street-input').val());
		// ($('#billing-street-input').val() == $('#address-street-input').val()) ? $('#billing-street-input').val('');
		$('#billing-city-input').val('');
		$('#billing-state-input').val('');
		$('#billing-zip-input').val('');
		$('#billing-street-input').removeAttr('disabled');
		$('#billing-city-input').removeAttr('disabled');
		$('#billing-state-input').removeAttr('disabled');
		$('#billing-zip-input').removeAttr('disabled');
	}
}

