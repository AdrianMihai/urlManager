var timerId; //used for keeping track of the timeout for the password warning

//function that checks if the password contains at least one digit
//returns true/false
function look_for_number(password){
	var patt = /[0-9]/g;

	return patt.test(password);
}

//function that checks if the password contains at least one digit
//returns true/false
function look_for_space(password){
	var patt = /\s/g;

	return patt.test(password.trim());
}

//function that checks if the password contains at least one uppercase
//returns true/false
function look_for_uppercase(password){
	var patt = /[A-Z]/g;

	return patt.test(password);
}

//function that checks if the password contains at least one symbol(except for @, #)
//returns true/false
function look_for_specialchars(password){
	var patt = /[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/g;

	return patt.test(password);
}

//function that checks if the password contains at least one lowercase
//returns true/false
function hasLowercase(password){
	var patt = /[a-z]/g;

	return patt.test(password);
}

//function that calculates the strength of the password
function calc_strength(password, pass_check){
	var k = 1;

	pass_check.number = look_for_number(password);
	pass_check.uppercase = look_for_uppercase(password);
	pass_check.specialchars = look_for_specialchars(password);
	pass_check.len = (password.length >= 8 && password.length <= 16);

	for(var key in pass_check)
		if(pass_check[key])
			k++;
			

	if(k == 1)
		return 1;
	else{
		k--;
	}
	
	if((k == 3 || k == 4) && (!pass_check.len || !hasLowercase(password)))
		k--;

	return k;
}

//function that makes the section containing the password information appear/disappear
function toggleIndicators(currentForm, passwordStr){
	var infContainer = currentForm.find('.information-container');

	if(passwordStr === 0)
		infContainer.removeClass('visible');
	else if(passwordStr > 0)
		infContainer.addClass('visible');
}

//function that animates the color and changes the text of the password result
//for example the password can be weak, strong etc
function passwordText(passwordStr){
	var i, text_classes = ['text-bad', 'text-weak', 'text-ok', 'text-strong'],
			result_texts = ['Your password is bad.', 'Your password is weak.', 'Your password is ok.', 'Your password is strong.'];

	for(i = 0; i < 4; i++)
		$('form[data-tag="passValidation"] .information-container .result-text').removeClass(text_classes[i]);

	passwordStr--;//so that the strength of the password(which is from 1 to 4) matches the indexes of
				// text_classes and result_texts arrays

	$('form[data-tag="passValidation"] .information-container .result-text').text(result_texts[passwordStr]);
	$('form[data-tag="passValidation"] .information-container .result-text').addClass(text_classes[passwordStr]);
}

//function that hides the password warning (the message saying the confirmation password is different from the initial one)
function hideWarning(currentForm){
	var warningObj = $(currentForm).find('.information-container .pass-warning').eq(0);

	if(timerId)
		clearTimeout(timerId);

	if(warningObj.data('toggled') === true){
		warningObj.data("toggled", false);
		warningObj.removeClass('showIt');
	}
}

//function that shows the password warning and after 5 seconds
//it makes the message disappear
function showWarning(currentForm){
	var warningObj = $(currentForm).find('.information-container .pass-warning').eq(0);

	//console.log(warningObj);
	if(timerId)
		clearTimeout(timerId);

	if(warningObj.data('toggled') === false){
		warningObj.data("toggled", true);
		warningObj.addClass('showIt');

		timerId = setTimeout(function(){ hideWarning(currentForm); }, 7000);

		return timerId;
	}

}

//function that shows/hides the list with all the password hints
//the action can be show/hide
function toggleHintsList(currentForm, action){
	var hintsList = $(currentForm).find('.hints ul');

	if(action === 'show' && hintsList.data('toggled') == false){
		hintsList.data('toggled', true);
		hintsList.addClass('visible');
	}
	else if(action === 'hide' && hintsList.data('toggled') == true){
		hintsList.data('toggled', false);
		hintsList.removeClass('visible');
	}
		
}

//function that toggles the class on the list element with a given index if a criteria of the password is checked
//the validation can be true/false
function toggleHint(currentForm, index, validation){
	var liElement = currentForm.find('.hints ul li').eq(index);

	if(validation === false)
		liElement.removeClass('validated');
	else if(validation === true)
		liElement.addClass('validated');

}

//function that decides what criteria the password does/does not  fulfill 
//and does the animations of the hints' list
function validateHints(currentForm, password, pass_check){
	var validation, hintIndex, key,
		hintsList = $(currentForm).find('.hints ul');

		for(key in pass_check){
			validation = false;
			if(pass_check[key] === true)
				validation = true;
			switch(key){
				case 'len':
					hintIndex = 0;
					if(!hasLowercase(password))
						validation = false;
					break;
				case 'uppercase':
					hintIndex = 1;
					break;
				case 'number':
					hintIndex = 2;
					break;
				case 'specialchars':
					hintIndex = 3;
					break;
				default:
					break;
			}

			toggleHint(currentForm, hintIndex,  validation);
		}

}

//function that extends JQuery with methods that help
//validating passwords outside this form
function extendValidation(){
	jQuery.fn.extend({
		//function that validates the password inputs in your form
		//it also does the necessary animation of the password warning and the password hints
		//returns true/false
		validPassword : function(){
				//remove unnecessary spaces from the inputs
				var password = $(this).find('input[data-tag="password"]').eq(0).val(),
					passwordConf = $(this).find('input[data-tag="passwordConf"]').eq(0).val(),
					pass_check = {
						'number' : false,
						'uppercase' : false,
						'specialchars' : false,
						'len' : false
					}, pass_strength = calc_strength(password, pass_check), isOk = true;

					if(password.length && passwordConf.length){
						if(password != passwordConf){
							timerId = showWarning(this, timerId);
							isOk = false;
						}
						else
							hideWarning(this, timerId);
					}
					else
						isOk = false;							

					if(pass_strength < 3){
						toggleHintsList(this, 'show');
						isOk = false;
					}
					else
						toggleHintsList(this, 'hide');

					return isOk;
			}
			
	});
}

//main function that executes once the document has loaded
function main(){
	var password, passwordConf,
	 	pass_check = {
			'number' : false,
			'uppercase' : false,
			'specialchars' : false,
			'len' : false
		},
		old_str = 0, new_str = 1, i;

	extendValidation();//extend Jquery with methods for validating the form

	//keyup event for the main password input
	$('form[data-tag="passValidation"] input[data-tag="password"]').keyup(function(){

		var currentForm = $('form[data-tag="passValidation"]').eq(0),
			formIndex = currentForm.index('form[data-tag="passValidation"]');
		password = $(this).val().trim();//get tne value of the password input
		
		new_str = calc_strength(password, pass_check);//calculate the strength of the new password

		//do the necessary animations
		passwordText(new_str);
		validateHints(currentForm, password, pass_check);

		if(new_str > old_str){
			for(i = old_str; i <= new_str; i++){
				if(i === 0)
					currentForm.find('.strength-calculator .indicator li:first-child .colored').addClass('full-box');
				else
					currentForm.find('.strength-calculator .indicator li:nth-child(' + i.toString() + ') .colored').addClass('full-box');
				
			}
				
		}
		else if(new_str < old_str){
			for(i = old_str; i > new_str; i--)
				currentForm.find('.strength-calculator .indicator li:nth-child(' + i.toString() + ') .colored').removeClass('full-box');
		}

		if(!password.length){
			currentForm.find('.strength-calculator .indicator li:first-child .colored').removeClass('full-box');
			toggleHintsList(this, 'hide');//hide the passwords hints
			old_str = 0;
		}
		else
			old_str = new_str;


		toggleIndicators(currentForm, old_str);

		//console.log(new_str);
	});

}
