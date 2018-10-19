var swal = require('sweetalert2');

module.exports = function Alert()
{
	return swal.mixin({
		confirmButtonClass: 'btn btn-primary px-5',
		cancelButtonClass: 'btn btn-secondary px-5',
		buttonsStyling: false,
	});
}