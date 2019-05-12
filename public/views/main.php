<!DOCTYPE html>
<html>
<head>
	<title>URLs Manager</title>
	<meta name = "viewport" content = "width = device-width, initial-scale = 1">
	<meta name="csrf-token" content = "<?php echo Auth::getCsrfToken();?>"/>

	<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
	<link rel="stylesheet" type="text/css" href="/public/css/main.css">
	
	<script defer src="https://code.getmdl.io/1.3.0/material.min.js"></script>
</head>

<body>
	<div id = "react"></div>
	<script type="text/javascript">

		function postData(url = ``, data = {}) {
			data["_token"] = document.head.querySelector('meta[name="csrf-token"]').content;

			// Default options are marked with *
			return fetch(url, {
			    method: "POST", // *GET, POST, PUT, DELETE, etc.
			    mode: "cors", // no-cors, cors, *same-origin
			    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
			    credentials: "same-origin", // include, *same-origin, omit
			    headers: {
			        "Content-Type": "application/json",
			        //"Content-Type": "application/x-www-form-urlencoded",
			    },
			    redirect: "follow", // manual, *follow, error
			    referrer: "no-referrer", // no-referrer, *client
			    //body: JSON.stringify(data), // body data type must match "Content-Type" header
			    body: JSON.stringify(data)
			})
			//.then(response => response.json()); // parses JSON response into native Javascript objects 
			.then(response => {
				//console.log(response.text());
				return response.json();
			});
		}

		function postDataText(url = ``, data = {}) {
			data["_token"] = document.head.querySelector('meta[name="csrf-token"]').content;

			// Default options are marked with *
			return fetch(url, {
			    method: "POST", // *GET, POST, PUT, DELETE, etc.
			    mode: "cors", // no-cors, cors, *same-origin
			    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
			    credentials: "same-origin", // include, *same-origin, omit
			    headers: {
			        "Content-Type": "application/json",
			        //"Content-Type": "application/x-www-form-urlencoded",
			    },
			    redirect: "follow", // manual, *follow, error
			    referrer: "no-referrer", // no-referrer, *client
			    //body: JSON.stringify(data), // body data type must match "Content-Type" header
			    body: JSON.stringify(data)
			})
			//.then(response => response.json()); // parses JSON response into native Javascript objects 
			.then(response => {
				console.log(response.text());
				return response.json();
			});
		}
	</script>

	<script type="text/javascript" src = "/public/js/transformedApps/mainApp/indexApp.js"></script>
</body>
</html>