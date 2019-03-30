<?php

    class user extends Store {

        public $forms;

        function __construct($data) {

            $this->forms = new Forms(array(
                'name' => 'user',
                'fields' => array(
                    'email' => array(
                        'type' => 'VARCHAR',
                        'length' => 100
                    ),
                    'pass' => array(
                        'type' => 'VARCHAR',
                        'length' => 32,
                        'null' => true
                    ),
                    'type' => array(
                        'type' => 'ENUM',
                        'values' => array(
                            'admin',
                            'user',
                            'workgroup'
                        ),
                        'default' => 'user'
                    )
                )
            ), array(
                'auto_create_table' => true
            ));
        }
    }
?>
            	