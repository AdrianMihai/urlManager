<?php
	include_once "model.php";

	/**
	 * 
	 */
	class UrlCategory extends Model
	{
		
		function __construct($dbConnection, $table)
		{
			parent::__construct($dbConnection, $table);
		}

		public function getCategories() {
			$acceptedKeys = ["Id", "Name"];
			$categories = $this->getAll();
			$result = [];

			foreach ($categories as $category) {
				$aux = [];
				foreach ($category as $key => $value) {
					if (in_array($key, $acceptedKeys, true)) {
						$aux[$key] = $value;
					}
				}

				array_push($result, $aux);
			}
			
			return $result;
		}

	}
?>