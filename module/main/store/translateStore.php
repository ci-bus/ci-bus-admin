<?php 
    class translate extends Store {
        function __construct($lang) {
            if ($lang == 'es') {
                $this->parseStore('translate', array(
                    'apps' => 'Aplicaciones',
                    'users' => 'Usuarios'
                ));
            }
        }
    }
?>
            	