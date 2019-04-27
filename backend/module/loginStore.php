<?php 

    class Login extends Store {
            
        public function __construct($data = array())
        {
            
        }

        public function post($data) {
            $user = $data['user'];
            $pass = $data['pass'];

            $this->select('*');
            $this->where('user', $data['user']);
            $this->where('pass' , $data['pass']);
            $data = $this->getArray('user');
            $this->parseStoreData('login', $data);
        }
  }
?>