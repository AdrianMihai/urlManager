<?php

	/**
	 * 
	 */
	class Auth
	{
		
		public static function generateCsrfToken() {
			return bin2hex(mcrypt_create_iv(32, MCRYPT_DEV_URANDOM));
		}

		public static function getCsrfToken() {
			return $_SESSION['csrf_token'];
		}

		public static function setCsrf() {
			if (!isset($_SESSION['csrf_token'])) {
				$_SESSION['csrf_token'] = Auth::generateCsrfToken();
			}
		}

		public static function checkToken($token) {

			if (empty($_SESSION['csrf_token'])) {
				return false;
			}

			return hash_equals($_SESSION['csrf_token'], $token);
		}

		public static function getUserId() {
			return $_SESSION['userData']['Id'];
		}

		public static function getPublicUserData() {
			$userData = $_SESSION['userData'];
			unset($userData['Id']);

			return $userData;
		}

		public static function isLoggedIn() {
			return isset($_SESSION['userData']);
		}

		public static function logIn($userData) {
			$_SESSION['userData'] = $userData;
		}

		public static function logOut() {
			unset($_SESSION['userData']);
			unset($_SESSION['csrf_token']);
		}
	}
?>