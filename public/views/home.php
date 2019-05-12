<!DOCTYPE html>
<html>
<head>
	<title>URLs Manager</title>
	<meta name = "viewport" content = "width = device-width, initial-scale = 1">
	<meta name="csrf-token" content = "<?php echo Auth::getCsrfToken();?>"/>

	<link rel="stylesheet" 
		href="https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.amber-light_blue.min.css">
	
	<link rel="stylesheet" type="text/css" href="/public/css/login.css">
	<link rel="stylesheet" type="text/css" href="/public/css/passValidation.css">
</head>
<body>
	
	<img class="background-image" src="/public/img/inhabited_walls_magic.jpg" alt="Space Image" />
	<img class="background-image" id="connected"
		src="/public/img/inhabited_walls_connected.jpg" alt="Space Image" />

	<div id = "forms">
		<h4 class="title">Welcome to the Link Manager</h4>
		<div class="mdl-tabs mdl-js-tabs mdl-js-ripple-effect">
			<div class="mdl-tabs__tab-bar">
			  <a href="#login-form-container" class="mdl-tabs__tab is-active">Log in</a>
			  <a href="#signup-form-container" class="mdl-tabs__tab">Sign up</a>
			</div>

			<div class="mdl-tabs__panel is-active" id="login-form-container">
				<form id = "login-form">
					<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
    					<input class="mdl-textfield__input" id="email-login" type="text" >
    					<label class="mdl-textfield__label" for="user-login">Email</label>
  					</div>
  					<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
    					<input class="mdl-textfield__input" type="password" id="password-login">
    					<label class="mdl-textfield__label" for="password-login">Password</label>
  					</div>

  					<button 
  						type = "submit"
  						class="mdl-button mdl-js-button mdl-button--raised mdl-button--accent mdl-js-ripple-effect">
  						Log in
					</button>
				</form>
			</div>

			<div class="mdl-tabs__panel" id="signup-form-container">
				<form id = "signup-form" data-tag="passValidation">
					<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
    					<input class="mdl-textfield__input" type="text" id="username-signup">
    					<label class="mdl-textfield__label" for="user-login">Username</label>
  					</div>
					<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
    					<input class="mdl-textfield__input" type="email" id="email-signup">
    					<label class="mdl-textfield__label" for="user-login">Email</label>
  					</div>
  					<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
    					<input class="mdl-textfield__input" type="password" id="password-signup" data-tag="password" >
    					<label class="mdl-textfield__label" for="password-login">Password</label>
  					</div>
					<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
    					<input class="mdl-textfield__input" type="password" id="password-conf-signup" data-tag="passwordConf">
    					<label class="mdl-textfield__label" for="password-login">Password Confirmation</label>
  					</div>
					
					<div class="information-container">

						<!--WARNING TEXT -->
						<p class="pass-warning text-bad" data-toggled="false">The passwords do not match!</p>
						<!--end WARNING TEXT -->

						<div class="strength-calculator">
							<ul class="indicator">
								<li>
									<div class="colored password-bad "></div> <!-- Used for coloring the box -->
								</li>
								<li>
									<div class="colored password-weak"></div> <!-- Used for coloring the box -->
								</li>
								<li>
									<div class="colored password-ok"></div> <!-- Used for coloring the box -->
								</li>
								<li>
									<div class="colored password-strong"></div> <!-- Used for coloring the box -->
								</li>
							</ul>

							<!--RESULT TEXT -->
							<p class="result-text text-weak">Your password is weak.</p>

							<hr><!-- HORIZONTAL LINE -->
						</div>
						<!--end div.strength-calculator-->
					</div>

					<!--HINT'S LIST -->
					<div class="hints">
						<ul data-toggled="false">
							<li>The password must have between 8 and 16 characters with at least one lowercase.</li>
							<li>It should also have an uppercase. [A-Z]</li>
							<li>Or a digit at least. [0-9]</li>
							<li>Special characters work too. [!$%^&*()...]</li>
						</ul>
					</div>
					<!--end HINT'S LIST -->

  					<button class="mdl-button mdl-js-button mdl-button--raised mdl-button--accent mdl-js-ripple-effect">
  						Sign up
					</button>
				</form>
			</div>

		</div>
	</div>
	
	<div id="error-message" class="mdl-snackbar mdl-js-snackbar">
    	<div class="mdl-snackbar__text"></div>
    	<button class="mdl-snackbar__action" type="button"></button>
	</div>
	
	<script defer src="https://code.getmdl.io/1.3.0/material.min.js"></script>
	<script
		src="https://code.jquery.com/jquery-3.4.0.min.js"
		integrity="sha256-BJeo0qm959uMBGb65z40ejJYGSgR7REI4+CW1fNKwOg="
		crossorigin="anonymous"></script>
	<script type="text/javascript" src = "/public/js/passValidation.js"></script>
	<script type="text/javascript" src = "/public/js/loginPage.js"></script>
</body>
</html>