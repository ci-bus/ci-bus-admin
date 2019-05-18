cb.define({
    xtype: 'controller',
    name: 'user',
    
    onload: function () {
        
        cb.loadLineal([
            ['store', 'user', 'user']
        ], function () {
            cb.getStore('user').get({init: 1}, function () {
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
                        fields: ['user', 'type'],
                        /*
                        beforeItems: {
                            xtype: 'button',
                            text: 'Extra 1'
                        },
                        afterItems: {
                            xtype: 'button',
                            text: 'Extra 2'
                        }
                        */
                    },
    
                    view: { // Optional configs
                        
                        opt: {
                            type: 'primary',
                            head: {
                                text: 'Datos del usuario'
                            }
                        },
                        /*
                        fields: ['email', 'type'],
    
                        beforeItems: {
                            xtype: 'button',
                            text: 'Extra 1'
                        },
                        afterItems: {
                            xtype: 'button',
                            text: 'Extra 2'
                        }
                        */
                    },

                    edit: {
                        //fields: ['user', 'type']
                    },

                    new: {
                        
                    },

                    // Events
                    preInsert: function (data) {
                        console.log('Creating user', data);
                        // data can be changed
                        return data;
                    },
                    posInsert: function (res) {
                        if (res.response == 'success') {
                            console.log('User created');
                        }
                        // res can be changed
                        return res;
                    }/*,
                    preUpdate: function () {},
                    posUpdate: function () {},
                    preDelete: function () {},
                    posDelete: function () {}
                    */,
                    translate: {
                        user: 'User'
                    }
                });
            });
        });
    }
});