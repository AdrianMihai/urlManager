<?php
	class DB extends PDO{

		//connects to the database
		public function __construct($dsn, $username, $password, $driver_options = null){
			parent::__construct($dsn, $username, $password, $driver_options);
			//$this->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		}
		
		public function insert_XML($xml_file){
			$inserted = [];
			$xml = simplexml_load_file($xml_file);
			for ($i = 0; $i < count($xml->expressions); $i++) { 
				$_this = $xml->expressions[$i];
				$insert[$i] = [
					'id' => (int)$_this->ID,
					'verb_id' => (int)$_this->verb_id,
					'expression' => (string)$_this->expression,
					'explanation' => (string)$_this->explanation,
					'example' => (string)$_this->example
				];
			}
			return $DB->insert('expressions', $insert);
		}
	}


?>