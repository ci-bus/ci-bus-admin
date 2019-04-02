<?php

    class user extends Store {

        public $forms;

        function __construct($data) {

            $this->forms = new Forms(array(
                'name' => 'user',
                'fields' => array(
                    'email' => array(
                        'type' => 'VARCHAR',
                        'length' => 100,
                        'translate' => 'Email'
                    ),
                    'pass' => array(
                        'type' => 'VARCHAR',
                        'length' => 32,
                        'null' => true,
                        'translate' => 'Contraseña'
                    ),
                    'type' => array(
                        'type' => 'ENUM',
                        'values' => array(
                            'admin',
                            'user',
                            'workgroup'
                        ),
                        'default' => 'user',
                        'translate' => 'Tipo'
                    )
                )
            ), array(
                'auto_create_table' => true
            ));

            if ($data['action'] == 'get') {
                $data = $this->forms->get();
                $this->parseStore('defUser', $this->forms->getTable());
                $this->parseStore('user', $data);
            }
        }
    }
?>
            	