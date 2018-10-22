var swal = require('sweetalert2');

module.exports = function Alert()
{
	var Alert = swal.mixin({
		confirmButtonClass: 'btn btn-primary px-5',
		cancelButtonClass: 'btn btn-secondary px-5',
		buttonsStyling: false,
	});
	
	Alert.toast = Alert.mixin({
		toast: true,
		position: 'top-end',
		showConfirmButton: false,
		timer: 3000,
	});
	
	return Alert;
}