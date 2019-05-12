$(document).ready(function() {
	var notification = document.getElementById('error-message');
	

	$('form#login-form').submit(function(event) {
		event.preventDefault();

		let email = $('#email-login').val(),
			password = $('#password-login').val(),
			_token = $('meta[name="csrf-token"]').attr('content');
		
		//console.log(_token);

		if (email.length > 0 && password.length > 0) {
			let postRequest = $.post( "login", {email, password, _token});

			postRequest.done((response) => {
				response = JSON.parse(response);
			
				if (response.status === "ERROR") {
					//console.log(notification.MaterialSnackbar);
					notification.MaterialSnackbar.showSnackbar(
						{
							message: response.message
						}
					);
				}
				else if (response.status === "OK") {
					location.reload(true);
				}
			});
		}
		
		//console.log(email, password);
		
	});

	main();

	//submit event of the form containing the password inputs
	$('form[data-tag="passValidation"]').submit(function(event){
		event.preventDefault();
		
		let username = $('#username-signup').val(),
			email = $('#email-signup').val(),
			_token = $('meta[name="csrf-token"]').attr('content');

		if($(this).validPassword() && username.length > 0 && email.length > 0){
			let password = $('#password-signup').val();
			let postRequest = $.post( "signup", {username, email, password, _token});
			
			postRequest.done((response) => {
				response = JSON.parse(response);

				console.log(response);

				notification.MaterialSnackbar.showSnackbar(
					{
						message: response.message
					}
				);
			});
		}
	});
});