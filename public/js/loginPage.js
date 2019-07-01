function clearSignupInputs() {
	$('#username-signup').val('');
	$('#email-signup').val('');
	$('#password-signup').val('');
	$('#password-conf-signup').val('');
}

$(document).ready(function() {
	var notification = document.getElementById('error-message');
	

	$('form#login-form').submit(function(event) {
		event.preventDefault();

		let email = $('#email-login').val(),
			password = $('#password-login').val(),
			_token = $('meta[name="csrf-token"]').attr('content');
		
		//console.log(_token);

		if (email.length > 0 && password.length > 0) {
			$.post( "login", {email, password, _token})
			.done(function(response){
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
			})
			.fail(function(jqXHR, textStatus, errorThrown ) {
				//console.log(textStatus);
				//console.log(errorThrown);
				notification.MaterialSnackbar.showSnackbar(
					{
						message: `${errorThrown}. You should refresh the page and try again.`
					}
				);
			});

		}	
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

				if (response.status === "OK") {
					clearSignupInputs();
				}
			});
		}
	});
});