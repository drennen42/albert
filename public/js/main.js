console.log('in main.js');

console.log('sessionStorage: ', sessionStorage);

$('[data-js~=nav-li]').on('click', function(evt){
	console.log('inside click handler');
	$(evt).preventDefault();
	$(evt).stopPropagation();
	const $target = $(evt).target;
	console.log('$target: ', $target);
	$target.closest('li').addClass('active');
});