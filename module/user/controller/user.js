cb.define({
    xtype: 'controller',
    name: 'user',
    
    onload: function () {
        
        cb.loadAll([
            ['store', 'user', 'user', {action: 'get'}]
        ], function () {
            cb.ctr('forms', 'init', {
                name: 'user', // Mandatory
                module: 'user', // Mandatory
                store: 'user', // Mandatory
                field: 'record', // Mandatory
                defStore: 'defUser', // Mandatory
                renderTo: 'app-user', // Mandatory
    
                type: 'primary',
                head: {
                    text: 'Listado de usuarios'
                },
                footer: {
                    text: 'Creado por Miguel Ángel'
                },
                
                browse: { // Optional configs
                    /*
                    refresh: function () {
                        cb.load('store', 'user', 'user', {action: 'get'});
                    },
                    opt: {
                        type: 'primary',
                        head: {
                            text: 'Listado de usuarios'
                        },
                        footer: {
                            text: 'Creado por Miguel Ángel'
                        }
                    },
                    */
                    beforeItems: {
                        xtype: 'button',
                        text: 'Extra 1'
                    },
                    afterItems: {
                        xtype: 'button',
                        text: 'Extra 2'
                    }
                },

                view: {
                    /*
                    opt: {
                        type: 'primary',
                        head: {
                            text: 'Datos del usuario'
                        }
                        // ...
                    },
                    */
                    beforeItems: {
                        xtype: 'button',
                        text: 'Extra 1'
                    },
                    afterItems: {
                        xtype: 'button',
                        text: 'Extra 2'
                    }
                }
            });
        });
    }
});