<?php
	session_start();
	include_once "app/db.php";
	include_once "app/auth.php";
	include_once "app/model/request.php";
	include_once "app/model/user.php";
	include_once "app/model/urlCategory.php";
	include_once "app/model/url.php";

	$db = new DB(
		$_SERVER['DATABASE_NAME'],
		$_SERVER['DATABASE_USER'], 
		$_SERVER['DATABASE_PASSWORD'],
		array( 
			PDO::ATTR_PERSISTENT => true,
			PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
		)
	);

	$request = new Request(
		$_SERVER['REQUEST_URI'],
		$_SERVER['REQUEST_TIME'],
		$_SERVER['REQUEST_METHOD'],
		$db
	);

	$request->get('', function($request) {
		if (Auth::isLoggedIn()) {
			include_once "public/views/main.php";	
		}
		else {
			include_once "public/views/home.php";
		}
		
	});

	//Route for accessing an existing account
	$request->post('login', function($request) {
		$userModel = new User($request->getDbConnection(), 'users');
		if ($userModel->emailExists($_POST['email'])) {
			if ($userModel->checkPassword($_POST['email'], $_POST['password'])){
				//echo var_dump();
				Auth::logIn($userModel->getUserData($_POST['email']));
				//header('Location: /');
				echo json_encode($request->buildResponse("OK", "Successfully logged in."));
			}
			else {
				echo json_encode($request->buildResponse(
					Request::MESSAGE_ERROR,
					"The password does not match for the given account."
				));
			}
			
		}
		else {
			echo json_encode($request->buildResponse(
					Request::MESSAGE_ERROR,
					"The email does not exist!"
				));
		}
	});

	//Route for creating a new account
	$request->post('signup', function($request) {
		
		if (!array_key_exists('username', $_POST) or !array_key_exists('email', $_POST)
			or !array_key_exists('password', $_POST)) {

				echo json_encode($request->buildResponse(
					Request::MESSAGE_ERROR,
					"Invalid input data."
				));
		}
		else {
			$userModel = new User($request->getDbConnection(), 'users');

			if (!$userModel->emailExists($_POST['email'])) {
				try {
					$userModel->insertUser($_POST['username'], $_POST['email'], $_POST['password']);
					echo json_encode($request->buildResponse(
						Request::MESSAGE_OK,
						'Account successfully created.'
					));
				}
				catch(Exception $e){
					echo json_encode($request->buildResponse(
						Request::MESSAGE_ERROR,
						$e->getMessage()
					));
				}
					
			}
			else {
				echo json_encode($request->buildResponse(
						Request::MESSAGE_ERROR,
						"There is already an account having this email!"
					));
			}
		}
		
	});

	$request->get('logout', function($request) {
		$userModel = new User($request->getDbConnection(), 'users');
		if (Auth::isLoggedIn()) {
			Auth::logOut();
		}

		header('Location: /');
	});

	$request->post('userData', function($request) {

		if (Auth::isLoggedIn()) {

			echo json_encode(Auth::getPublicUserData());
		}
		else {
			echo json_encode("not authenticated");
		}
		
	});

	$request->post('urlCategories', function($request) {
		$urlCategoryModel = new urlCategory($request->getDbConnection(), 'urlcategories');
		echo json_encode($urlCategoryModel->getCategories());
	});

	$request->post('getUrls', function($request) {
		if (Auth::isLoggedIn()) {
			$urlModel = new UrlModel($request->getDbConnection(), 'urls');
			$urlCategoryModel = new urlCategory($request->getDbConnection(), 'urlcategories');
			echo json_encode($urlModel->getUrls(Auth::getUserId(), $urlCategoryModel->getCategories()));
		}
		else {
			echo json_encode("not authenticated");
		}
	});

	$request->post('addUrl', function($request) {
		if (Auth::isLoggedIn()) {
			$dbConnection = $request->getDbConnection();
			$urlModel = new UrlModel($dbConnection, 'urls');
			$urlCategoryModel = new urlCategory($dbConnection, 'urlcategories');

			$urlData = $request->getJsonData();
			
			if (
				array_key_exists('category', $urlData)
				&& array_key_exists('link', $urlData)
				&& array_key_exists('category', $urlData) 
			) {
				try {
					$urlCategories = $urlCategoryModel->getCategories();

					$category = intval($urlData['category']);
					$insertedUrl = $urlModel->insertUrl(Auth::getUserId(), $urlData['link'], $category, $urlData['description']);

					foreach ($urlCategories as $category) {
						if ($category["Id"] == $insertedUrl['Category']) {
							$insertedUrl['Category'] = $category;
						}
					}
					
					echo json_encode($request->buildResponse(
							Request::MESSAGE_OK,
							$insertedUrl
						));
				}
				catch(Exception $e) {
					echo json_encode($request->buildResponse(
							Request::MESSAGE_ERROR,
							$e->getMessage()
						));
				}	
			}
			else {
				echo json_encode($request->buildResponse(
							Request::MESSAGE_ERROR,
							"Invalid input data!"
						));
			}
			
			
		}
		else {
			echo json_encode("not authenticated");
		}
	});

	$request->post('deleteUrl', function($request) {
		if (Auth::isLoggedIn()) {
			$urlModel = new UrlModel($request->getDbConnection(), 'urls');

			$urlData = $request->getJsonData();

			if (array_key_exists('urlId', $urlData)) {
				$affectedRows = $urlModel->deleteUrl($urlData['urlId']);

				if ($affectedRows === 0) {
					echo json_encode($request->buildResponse(
						Request::MESSAGE_ERROR,
						"There's no url having the given id."
					));
				}
				else if ($affectedRows === 1) {
					echo json_encode($request->buildResponse(
							Request::MESSAGE_OK,
							"The url was successfully deleted."
						));
				}
			}
			else {
				echo json_encode($request->buildResponse(
						Request::MESSAGE_ERROR,
						"The id of the url was not supplied."
				));
			}
			
		}
		else {
			echo json_encode("not authenticated");
		}
	});

	$request->post('updateUrl', function($request) {
		if (Auth::isLoggedIn()) {
			$urlData = $request->getJsonData();
			if (array_key_exists('urlId', $urlData)
				&& array_key_exists('link', $urlData)
				&& array_key_exists('urlDescription', $urlData)
				&& array_key_exists('urlCategory', $urlData)
			) {
				$urlModel = new UrlModel($request->getDbConnection(), 'urls');
				try {
					$noAffectedRows = $urlModel->updateUrl(
						Auth::getUserId(),
						$urlData['urlId'],
						$urlData['link'],
						$urlData['urlCategory'],
						$urlData['urlDescription']
					);

					if ($noAffectedRows == 1) {
						$urlCategoryModel =  new urlCategory($request->getDbConnection(), 'urlcategories');
						$urlCategories = $urlCategoryModel->getCategories();
						$updatedUrl = $urlModel->getUrlById(intval($urlData['urlId']));

						foreach ($urlCategories as $category) {
							if ($category["Id"] == $updatedUrl['Category']) {
								$updatedUrl['Category'] = $category;
							}
						}

						echo json_encode($request->buildResponse(
							Request::MESSAGE_OK,
							$updatedUrl
						));
					}
					else {
						echo json_encode($request->buildResponse(
							Request::MESSAGE_ERROR,
							"There's no url having the given id or the url has not been modified."
						));	
					}
				}
				catch (Exception $e) {
					echo json_encode($request->buildResponse(
						Request::MESSAGE_ERROR,
						$e->getMessage()
					));
				}
				
			}
			else {
				echo json_encode($request->buildResponse(
						Request::MESSAGE_ERROR,
						"Not enough data was supplied for updating the url."
				));
			}
		}
		else {
			echo json_encode("not authenticated");
		}

	});

	$request->post('filterUrls', function($request) {
		if (Auth::isLoggedIn()) {
			$filterCriteria = $request->getJsonData();

			if (array_key_exists('category', $filterCriteria)
					&& array_key_exists('page', $filterCriteria)
					&& array_key_exists('rowsPerPage', $filterCriteria)
			) {
				$urlModel = new UrlModel($request->getDbConnection(), 'urls');

				try {
					$urls = $urlModel->paginatedUrlsFilter(
						Auth::getUserId(),
						$filterCriteria['category'],
						$filterCriteria['page'],
						$filterCriteria['rowsPerPage']
					);
					echo json_encode($request->buildResponse(
						Request::MESSAGE_OK,
						$urls
					));
				}
				catch (Exception $e) {
					echo json_encode($request->buildResponse(
						Request::MESSAGE_ERROR,
						$e->getMessage()
					));
				}

			}
			else {
				echo json_encode($request->buildResponse(
						Request::MESSAGE_ERROR,
						"Not enough data was supplied for filtering the urls."
				));
			}
		}
		else {
			echo json_encode("not authenticated");
		}
		
	});


	$request->sendResponse();

?>