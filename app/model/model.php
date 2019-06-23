<?php

	 /**
	 * 
	 */
	abstract class Model
	{
		protected $dbConnection = null;
		protected $table = '';

		public function __construct($dbConnection, $table) {
			$this->dbConnection = $dbConnection;
			$this->table = $table;
		}
		
		public function setDbConnection($db) {
			$this->dbConnection = $db;
		}

		public function setTable($table) {
			$this->table = $table;
		}

		//execute a SQL query
		public function execQuery($query, $params = [] ){
			try{
				if(count($params)){
					$params = is_array($params) ? $params : array($params);
					$result = $this->dbConnection->prepare($query);
					$result->execute($params);
					
					return $result->fetchAll(PDO::FETCH_ASSOC);
				}
				else{

					$stmt = $this->dbConnection->prepare($query);
					$stmt->execute();

					return $stmt->fetchAll(PDO::FETCH_ASSOC);
				}
				
			}
			catch (PDOException $e)
  			{
  				echo $e->getMessage();
      			/*throw new Exception(
           			__METHOD__ . 'Exception Raised for sql: ' . var_export($sql, true) .
            		' Params: ' . var_export($params, true) .
            		' Error_Info: ' . var_export($this->errorInfo(), true),
            		0,
           		$e);*/
   			}
		}

		public function insert($data){
			$table = $this->table;

			for ($i = 0; $i < count($data) ; $i++) { 
				$_this = $data[$i];

				$values = [];
				$query = 'INSERT INTO ' . $this->table . '(';

				$k = 0;

				foreach ($_this as $key => $value) {
					$query .= $key;
					array_push($values, $value);

					if($k != count($_this) - 1)
						$query .= ', ';

					$k++;
				}

				$query .= ') VALUES(';

				for ($j = 0; $j < count($values); $j++) { 
					$query .= '?';
					if($j != count($values) - 1)
						$query .= ', ';
				}

				$query .= ')';
				$this->query($query, $values);
			}
			return true;
		}

		public function insertOne($entity) {
			$query = 'INSERT INTO ' . $this->table . '(';

			$k = 0;
			$values = [];

			foreach ($entity as $key => $value) {
				$query .= $key;
				array_push($values, $value);

				if($k != count($entity) - 1)
					$query .= ', ';

				$k++;
			}

			$query .= ') VALUES(';

			for ($j = 0; $j < count($values); $j++) { 
				$query .= '?';
				if($j != count($values) - 1)
					$query .= ', ';
			}

			$query .= ')';

			$stmt = $this->dbConnection->prepare($query);
			$stmt->execute($values);
		}
		
		public function getAll() {
			$query = 'SELECT * FROM ' . $this->table;
			return $this->execQuery($query);
		}

		public function execUpdateStatement($query, $params = []) {
			try{
				if(count($params)){
					$params = is_array($params) ? $params : array($params);
					$result = $this->dbConnection->prepare($query);
					$result->execute($params);
					
					return $result->rowCount();
				}
				else{

					$stmt = $this->dbConnection->prepare($query);
					$stmt->execute();

					return $stmt->rowCount();
				}
				
			}
			catch (PDOException $e){
				echo $e->getMessage();
	  			/*throw new Exception(
	       			__METHOD__ . 'Exception Raised for sql: ' . var_export($sql, true) .
	        		' Params: ' . var_export($params, true) .
	        		' Error_Info: ' . var_export($this->errorInfo(), true),
	        		0,
	       		$e);*/
			}
		}
	}


?>