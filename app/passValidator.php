<?php

	class passValidator{

		protected $password;

		private static $instance;

		public function __construct($pass){
			$this->password = $pass;
		}

		public function __toString()
    	{
        	return $this->result();
    	}

    	//static constructor
		public static function getPassword($pass){
			if ( is_null( self::$instance ) )
    		{
      			self::$instance = new self($pass);
      			
    		}

    		return self::$instance;
		}

		//function that checks if the password contains at least one digit
		//returns true/false
		public function hasDigit(){
			if(isset($this->password))
				return preg_match('/[0-9]/', $this->password);
			else
				return false;
		}

		//function that checks if the password contains at least one uppercase
		//returns true/false
		public function hasUppercase(){
			if(isset($this->password))
				return preg_match('/[A-Z]/', $this->password);
			else
				return false;
		}

		//function that checks if the password contains at least one lowercase
		//returns true/false
		public function hasLowercase(){
			if(isset($this->password))
				return preg_match('/[a-z]/', $this->password);
			else
				return false;
		}

		//function that checks if the password contains at least one symbol(except for @, #)
		//returns true/false
		public function hasSymbol(){
			if(isset($this->password))
				return preg_match("/[-!$%^&*()_+|~=`{}\[\]:\";'<>?,.\/]/", $this->password);
			else
				return false;
		}

		//function that calculates the strength of the password and returns it
		//the strength is a number between 0 and 4
		protected function calcStrength(){
			//the algorithm gives the password one point for each criteria that is fulfilled
			//(if it has at least an uppercase, a symbol, a digit and the length between 8 and 16)

			if(!isset($this->password))
				return 0;

			$points = 0;
			$len = strlen($this->password);
			$pass_check = [
				'uppercase' => (bool)$this->hasUppercase(),
				'digit' => (bool)$this->hasDigit(),
				'symbol' => (bool)$this->hasSymbol(),
				'len' => ($len >= 8 && $len <= 16 ) ? true : false
			];

			foreach ($pass_check as $key => $value) {
				if($value === true)
					$points++;
			}

			//if the password has 3 points, but does not have the necessary length or does not have a lowercase
			//reduce the number of points to 2, so that it is not considered valid
			if($points === 3 && (!$pass_check['len'] || !$this->hasLowercase()) )
				$points--;

			return $points;
		}

		//function that interpretates the strength of the password, giving a result
		//return a string which can be 'bad', 'weak', 'ok' or 'strong'
		public function result(){
			$str = $this->calcStrength();

			switch ($str) {
				case 2:
					return 'weak';
					break;
				case 3:
					return 'ok';
					break;
				case 4:
					return 'strong';
					break;
				default:
					return 'bad';
					break;
			}
		}

		//function for checking if the password meets the requirements
		//(if the password's strength is greater than 2 and it is the same as the confirmation)
		public function isOk($passConf){
			if(!isset($passConf))
				return false;

			if(($this->calcStrength() > 2) && $this->password === $passConf)
				return true;
			else
				return false;
		}
	}

?>