<?php
	include_once "model.php";

	/**
	 * 
	 */
	class UrlModel extends Model
	{
		
		function __construct($dbConnection, $table)
		{
			parent::__construct($dbConnection, $table);
		}

		public function checkUrl($url) {
			/*return preg_match("/#([a-z]([a-z]|\d|\+|-|\.)*):(\/\/(((([a-z]|\d|-|\.|_|~|[\x00A0-\xD7FF\xF900-\xFDCF\xFDF0-\xFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?((\[(|(v[\da-f]{1,}\.(([a-z]|\d|-|\.|_|~)|[!\$&'\(\)\*\+,;=]|:)+))\])|((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|(([a-z]|\d|-|\.|_|~|[\x00A0-\xD7FF\xF900-\xFDCF\xFDF0-\xFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=])*)(:\d*)?)(\/(([a-z]|\d|-|\.|_|~|[\x00A0-\xD7FF\xF900-\xFDCF\xFDF0-\xFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*|(\/((([a-z]|\d|-|\.|_|~|[\x00A0-\xD7FF\xF900-\xFDCF\xFDF0-\xFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\x00A0-\xD7FF\xF900-\xFDCF\xFDF0-\xFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)|((([a-z]|\d|-|\.|_|~|[\x00A0-\xD7FF\xF900-\xFDCF\xFDF0-\xFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\x00A0-\xD7FF\xF900-\xFDCF\xFDF0-\xFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)|((([a-z]|\d|-|\.|_|~|[\x00A0-\xD7FF\xF900-\xFDCF\xFDF0-\xFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)){0})(\?((([a-z]|\d|-|\.|_|~|[\x00A0-\xD7FF\xF900-\xFDCF\xFDF0-\xFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\xE000-\xF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\x00A0-\xD7FF\xF900-\xFDCF\xFDF0-\xFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?#iS/", $url);*/
			return true;
		}

		public function getUrlById($urlId) {
			$url =  $this->execQuery(
				"SELECT Id, Link, Description, Category, AddedOn FROM ". $this->table . " WHERE Id = ?", [$urlId]
			)[0];

			return [
				"Id" => $url["Id"],
				"Link" => $url["Link"],
				"Description" => $url["Description"],
				"Category" => $url["Category"],
				"AddedOn" => $url["AddedOn"]
			];
		}

		public function getUrls($userId, $categories) {
			$acceptedKeys = ["Id", "Link", "Description", "Category", "AddedOn"];
			$urls = $this->execQuery("SELECT * FROM ". $this->table . " WHERE AddedBy = ?", [$userId]);
			$result = [];

			foreach ($urls as $url) {
				$aux = [];
				foreach ($url as $key => $value) {
					if (in_array($key, $acceptedKeys, true)) {

						if ($key == "Category") {
							foreach($categories as $category) {
								if ($category["Id"] == $value) {
									$aux[$key] = $category;
								}
							}
							
						}
						else {
							$aux[$key] = $value;
						}
						
					}
				}

				array_push($result, $aux);
			}
			
			return $result;
		}

		public function insertUrl($userId, $link, $category, $description) {
			$userId = intval($userId);
			$category = intval($category);

			if (strlen($link) == 0) {
				throw new Exception('The link cannot be empty.');
			}

			if (strlen($description) == 0) {
				throw new Exception('The description cannot be empty.');
			}

			$this->insertOne([
				"AddedBy" => $userId,
				"Link" => $link,
				"Description"=> $description,
				"Category" => $category
			]);
			return $this->getUrlById($this->dbConnection->lastInsertId());
		}

		public function updateUrl($userId, $urlId, $link, $category, $description) {
			$userId = intval($userId);
			$category = intval($category);
			$urlId = intval($urlId);

			if (strlen($link) == 0) {
				throw new Exception('The link cannot be empty.');
			}

			if (strlen($description) == 0) {
				throw new Exception('The description cannot be empty.');
			}

			return $this->execUpdateStatement("UPDATE ". $this->table . " SET AddedBy = ?, Link = ?, Description = ?, Category = ? WHERE Id = ?", [$userId, $link, $description, $category, $urlId]);
		}

		public function deleteUrl($urlId) {
			$urlId = intval($urlId);

			return $this->execUpdateStatement("DELETE FROM " . $this->table . " WHERE Id = ?", [$urlId]);
		}

		public function paginatedUrlsFilter($userId, $category, $pageNumber, $noRows) {
			$userId = intval($userId);
			$category = intval($category);

			$urls = $this->execQuery("SELECT * FROM ". $this->table . " WHERE AddedBy = ? AND Category = ?",
				[$userId, $category]);
			return [
				"categoryCount" => count($urls),
				"urls" => array_slice($urls, $pageNumber * $noRows, $noRows)
			];
		}

	}
?>