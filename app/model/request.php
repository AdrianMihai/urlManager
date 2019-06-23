<?php

	class Request
	{
		const MESSAGE_OK = "OK";
		const MESSAGE_ERROR = "ERROR";

		public $uri = '/';

		public $time= 1;

		public $method = '';

		protected $getRoutes = [];

		protected $postRoutes = [];

		private $dbConnection = null;

		public function __construct($req_uri, $req_time, $req_method, $dbConnection){
			$this->uri = $req_uri;
			$this->time = $req_time;
			$this->method = $req_method;
			$this->dbConnection = $dbConnection;

			Auth::setCsrf();
		}

		public function load_data($data){
			$this->data = $data;
		}

		public function all(){
			return $this->data;
		}

		public function getDbConnection() {
			return $this->dbConnection;
		}

		public function get($url, $callback) {
			$this->getRoutes[$url] = $callback;
		}

		public function getPostData($key) {
			if (array_key_exists($key, $_POST))
				return $_POST[$key];
			else
				return null;
		}

		public function getJsonData() {
			return json_decode(file_get_contents('php://input'), true);
		}

		public function post($url, $callback) {
			$this->postRoutes[$url] = $callback;
		}

		public function isGet() {
			return strtolower($this->method) == 'get';
		}

		public function isPost() {
			return strtolower($this->method) == 'post';
		}

		public function buildResponse($status, $output) {
			return [
				'status' => $status,
				'message' => $output
			];
		}

		public function sendResponse() {
			$pathElements = $elements = explode('/', ltrim($this->uri, '/'));
			
			//echo var_dump($pathElements);

			if (strlen($pathElements[0]) > 0) {
				if ($pathElements[0][0] == '?') {
					$firstSegment = array_key_exists(1, $pathElements) ? $pathElements[0] : '';
				}
			}
			else {
				$firstSegment = $pathElements[0];
			}

			//echo var_dump($pathElements);

			if ($this->isGet()) {
				if (array_key_exists($firstSegment, $this->getRoutes)){
					$this->getRoutes[$firstSegment]($this);	
				}
				else {
					//header("HTTP/1.0 404 Not Found");
					include_once "public/views/404.html";
				}
			}
			else if($this->isPost()) {
				if (array_key_exists($firstSegment, $this->postRoutes)) {
					$csrfToken = $this->getPostData('_token');

					if ($csrfToken == null) {
						$jsonData = $this->getJsonData();
						//echo var_dump($jsonData);
						if (array_key_exists('_token', $jsonData)) {

							$csrfToken = $jsonData['_token'];
						}
						else {
							header("HTTP/1.1 401 Unauthorized");
							return null;
						}
					}

					if (Auth::checkToken($csrfToken)) {
						$this->postRoutes[$firstSegment]($this);	
					}
					else {
						//header("HTTP/1.1 401 Unauthorized");
					}
				}

			}
		}
	}
?>