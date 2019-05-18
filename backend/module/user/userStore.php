<?php

    class user extends Store {

        public $forms;

        function __construct($data) {

            $this->forms = new Forms(array(
                'name' => 'user',
                'fields' => array(
                    'user' => array(
                        'type' => 'VARCHAR',
                        'length' => 100,
                        'translate' => '{user}',
                        'required' => true
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
                'auto_create_table' => true,
                'order_by' => array('id', 'DESC')
            ));
            
            if ($data['init']) {
                $this->parseStore('defUser', $this->forms->getTable());
            }
        }

        function GET($data) {
            $users = $this->forms->get();
            $this->parseStoreData('user', $users);
        }

        function POST($data) {
            if ($data['type'] == 'workgroup') {
                $data['pass'] = '';
            } else {
                if ($data['pass'] && !$this->isMD5($data['pass'])) {
                    $data['pass'] = md5($data['pass']);
                }
            }
            if ($updated_data = $this->forms->update($data)) {
                $this->parseResponse('success', $updated_data);
            } else {
                $this->parseResponse('fail', $this->error());
            }
        }

        function PUT($data) {
            if ($data['type'] == 'workgroup') {
                $data['pass'] = '';
            } else {
                if ($data['pass'] && !$this->isMD5($data['pass'])) {
                    $data['pass'] = md5($data['pass']);
                }
            }
            if ($inserted_data = $this->forms->insert($data)) {
                $this->parseResponse('success', $inserted_data);
            } else {
                $this->parseResponse('fail', $this->error());
            }
        }

        function DELETE($data) {
            if ($this->forms->delete($data)) {
                $this->parseResponse('success');
            } else {
                $this->parseResponse('fail', $this->forms->error());
            }
        }

        function isMD5($t) {
            return preg_match('/^[a-f0-9]{32}$/', $t);
        }
    }
?>
            	