<?php 
    class translate extends Store {
        function __construct($lang) {
            if ($lang == 'es') {
                $this->parseStore('translate', array(
                    'apps' => 'Aplicaciones',
                    'users' => 'Usuarios',
                    'new' => 'Nuevo',
                    'back' => 'Atrás',
                    'edit' => 'Editar',
                    'return' => 'Volver',
                    'delete' => 'Eliminar',
                    'search' => 'Buscar',
                    'refresh' => 'Recargar',
                    'view' => 'Ver',
                    'save' => 'Guardar'
                ));
            }
        }
    }
?>
            	