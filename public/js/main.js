$(document).ready(function (){

	$(function(){
	    $(".chosen-select").chosen();
	});

});

// $('[data-js~=nav-li]').on('click', function(evt){
// 	console.log('inside click handler');
// 	$(evt).preventDefault();
// 	$(evt).stopPropagation();
// 	const $target = $(evt).target;
// 	console.log('$target: ', $target);
// 	$target.closest('li').addClass('active');
// });