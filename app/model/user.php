<?php
	include_once "model.php";
	include_once "app/passValidator.php";

	class User extends Model{

		public function __construct($dbConnection, $table) {
			parent::__construct($dbConnection, $table);
		}

		public function insertUser($username, $email, $password) {
			if (strlen($username) == 0) {
				throw new Exception('The given username is empty.');
			}

			if (strlen($username) == 0) {
				throw new Exception('The given email is empty.');
			}

			if (!passValidator::getPassword($password)->isOk($password)) {
				throw new Exception('The given password is invalid.');
			}

			$password = password_hash($password, PASSWORD_BCRYPT);

			return $this->insertOne(
				[
					"Username" => $username,
					"Email" => $email,
					"Password" => $password
				]
			);
		}

		public function getUserData($email) {
			$selectResult = $this->execQuery('SELECT Id, Username, Email FROM ' . $this->table . ' WHERE Email = ?', [$email]);
			if (count($selectResult) == 1) {
				$selectResult = $selectResult[0];

				return [
					"Id" => $selectResult['Id'],
					"Username" => $selectResult['Username'],
					"Email" => $selectResult['Email']
				];
			}

			return null;
		}

		public function emailExists($email) {
			return count($this->execQuery('SELECT Id FROM ' . $this->table . ' WHERE Email = ?', [$email])) == 1;
		}

		public function checkPassword($email, $password) {
			$hashedPassword = 
				$this->execQuery('SELECT Password FROM ' . $this->table . ' WHERE Email = ?', [$email])[0]['Password'];

			return password_verify($password, $hashedPassword);
		}
	}

?>