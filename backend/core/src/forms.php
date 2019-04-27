<?php

    /*
        Example
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
                    'default' => 'user',
                    'collate' => 'utf8_bin'
                ),
                'number' => array(
                    'type' => 'INT',
                    'length' => 11,
                    'auto_increment' => true,
                    'primary_key' => true
                )
            )
        ), array(
            'create_table' => true
        ));
    */

    class Forms {

        private $table;
        private $config;
        private $db;

        function __construct($table = null, $config = null)
		{
            $this->db = new Db();
            $this->config = array(
                'engine' => 'InnoDB',
                'errors' => array(),
                'auto_create_table' => false,
                'order_by' => array('id', 'DESC'),
                'group_by' => null,
                'limit' => 10
            );
            if (is_array($config)) {
                $this->setConfig($config);
            }
			if (is_array($table)) {
                $this->setTable($table);
            }
            $this->init();
        }
        
        private function init()
        {
            if ($this->getConfig('auto_create_table') && $this->getTable('name') 
                && !$this->db->tableExists($this->getTable('name'))) {
                $this->createTable();
            }
        }

        public function setTable($table)
        {
            $this->table = $table;
        }
        public function getTable($d = null)
        {
            return $d? $this->table[$d]: $this->table;
        }

        public function setConfig($config)
        {
            $this->config = array_merge($this->config, $config);
        }
        public function getConfig($d = null)
        {
            return $d? $this->config[$d]: $this->config;
        }

        public function error($er = false)
		{
			if($er)
            {
                array_push($this->config['errors'], $er);
			}
			else
			{
				return $this->getConfig("errors");
			}
		}

        public function createTable()
        {
            $sql = "CREATE TABLE `".$this->table['name']."` (";
            $sql .= "`id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,";
            foreach ($this->table['fields'] as $field=>$opts)
            {
                $sql .= "`".$field."` ";
                $sql .= $opts['type'];
                if ($opts['values'] && count($opts['values'])) {
                    $sql .= "('".implode("','", $opts['values'])."')";
                }
                if ($opts['length']) {
                    $sql .= "(".$opts['length'].")";
                }
                if ($opts['collate']) {
                    $sql .= " COLLATE '".$opts['collate']."'";
                }
                if (!$opts['null']) {
                    $sql .= " NOT NULL";
                }
                if ($opts['default']) {
                    $sql .= " DEFAULT '".$opts['default']."'";
                }
                if ($opts['auto_increment']) {
                    $sql .= " AUTO_INCREMENT";
                }
                if ($opts['primary_key']) {
                    $sql .= " PRIMARY KEY";
                }
                if ($opts['comment']) {
                    $sql .= " COMMENT '".$opts['comment']."'";
                }
                $sql .= ",";
            }
            $sql = rtrim($sql, ",");
            $sql .= ") ENGINE=".$this->config['engine'];

            if (!$this->db->query($sql)) {
                $this->error($this->db->error());
                return false;
            }
            return true;
        }

        public function getFieldsList () {
            $fields = $this->getTable("fields");
            $list = array();
            foreach ($fields as $f => $p) {
                array_push($list, $f);
            }
            return $list;
        }

        public function get ($where, $order) {
            $config = $this->getConfig();
            $fields = $this->getFieldsList();
            $this->db->reset();
            if ($where) {
                $this->db->where($where);
            }
            $this->db->select("id, ".implode(",", $fields));
            $this->db->from($this->getTable("name"));
            if ($order) {
                $this->db->orderBy(implode(' ', $order));
            } else if ($config['order_by']) {
                if (is_array($config['order_by'])) {
                    $this->db->orderBy(implode(' ', $config['order_by']));
                } else {
                    $this->db->orderBy($config['order_by']);
                }
            }
            if ($config['group_by']) {
                $this->db->groupBy($config['order_by']);
            }
            if ($config['limit']) {
                $this->db->limit($config['limit']);
            }
            if (is_numeric($config['page']) && is_numeric($config['limit'])) {
                $this->db->limit(($config['limit'] * $config['page']).", ".$config['limit']);
            }
            $data = $this->db->getArray();
            if (!$data) {
                $this->error($this->db->error());
                $total = 0;
            } else {
                $this->db->reset();
                $this->db->select("count(id) as count");
                if ($config['group_by']) {
                    $this->db->groupBy($config['order_by']);
                }
                $count = $this->db->get($this->getTable("name"));
            }
            return array(
                'count' => $count->count,
                'record' => $data
            );
        }

        public function update ($data) {
            $config = $this->getConfig();
            $this->db->reset();
            $this->db->where('id', $data['id']);
            $res = $this->db->update($this->getTable("name"), $data);
            if ($res) {
                return $this->get(array(
                    'id' => $data['id']
                ));
            } else {
                return false;
            }
        }

        public function insert ($data) {
            $config = $this->getConfig();
            $this->db->reset();
            $this->db->insert($this->getTable("name"), $data);
            $id = $this->db->getInsertId();
            if ($id) {
                return $this->get(array(
                    'id' => $id
                ));
            } else {
                return false;
            }
        }

        public function delete ($data) {
            $config = $this->getConfig();
            $this->db->reset();
            $this->db->where(array(
                'id' => $data['id']
            ));
            if (!$this->db->delete($this->getTable("name"))) {
                $this->error($this->db->error());
                return false;
            }
            return true;
        }
    }
?>