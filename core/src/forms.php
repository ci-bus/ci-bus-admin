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
                'errors' => array()
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
    }
?>