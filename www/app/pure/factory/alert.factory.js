var swal = require('sweetalert2');

module.exports = function Alert()
{
	var mainAlert = swal.mixin({
		confirmButtonClass: 'btn btn-primary px-5 my-1',
		cancelButtonClass: 'btn btn-secondary px-5 my-1',
		buttonsStyling: false,
	});
	
	var toastAlert = mainAlert.mixin({
		toast: true,
		position: 'top-end',
		showConfirmButton: false,
		timer: 3000,
	});
	
	function showAlert(alert)
	{
		return function(title, text, type)
		{
			return alert(arguments.length <= 1 ? title : {
				titleText: title,
				text,
				type,
			});
		}
	}
	
	var Alert = showAlert(mainAlert);
	Alert.toast = showAlert(toastAlert);
	
	return Alert;
}