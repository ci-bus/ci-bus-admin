cb.define({
    xtype: 'controller',
    name: 'forms',

    forms_config: {},

    init: function (config) {
        if (this.checkConfig(config)) {
            this.setFormsConfig(config);
            // Do first action
            if (!config.action) {
                this.browse(config.name);
            }
        }
    },

    checkConfig: function (config) {
        var res = true;
        if (!config.name) {
            console.error('name is missing');
            res = false;
        }
        if (!config.renderTo) {
            console.error('renderTo is missing, this value must be the id of forms component');
            res = false;
        }
        if (!config.store) {
            console.error('store is missing');
            res = false;
        }
        if (!config.defStore) {
            console.error('defStore is missing, this store must contain the definition table');
            res = false;
        } else {
            var defStore = cb.getStore(config.defStore);
            if (!defStore) {
                console.error('Store ' + config.defStore + ' with definition table is missing');
                res = false;
            }
        }
        if (!config.module) {
            console.error('module of store is missing');
            res = false;
        }

        return res;
    },

    setFormsConfig: function (config) {
        this.forms_config[config.name] = config;
    },

    getFormsConfig: function (name) {
        return this.forms_config[name];
    },

    /*----------*\
    |   BROWSE   |
    \*----------*/
    browse: function (name) {
        var config = cb.cloneObject(this.getFormsConfig(name));
        var opt = {
            xtype: 'grid',
            storelink: true,
            columns: [{
                name: 'ID',
                text: '{id}',
                type: '{ctype}'
            }],
            body: {
                css: {
                    overflow: 'auto'
                },
                table: {
                    type: 'hover',
                    trListeners: {
                        click: function () {
                            cb.ctr('forms', 'view', {
                                name: name,
                                record: cb.getCmp(this).getRecord()
                            });
                        }
                    },
                    border: '1px solid #DDD'
                }
            }
        };
        // Add columns table
        var defStore = cb.getStore(config.defStore);
        for (field in defStore.getData('fields')) {
            if (!config.browse || !config.browse.fields || config.browse.fields.indexOf(field) > -1) {
                var f = defStore.getData('fields')[field];
                opt.columns.push({
                    name: f['translate'],
                    text: '{' + field + '}',
                    type: '{ctype}'
                });
            }
        }
        // Add buttons refresh, search and new
        config.beforeItems = {
            xtype: 'div',
            pull: 'left',
            padding: '5px 0 0 5px',
            defaults: {
                margin: '0 5px 5px 0'
            },
            items: [{
                xtype: 'button',
                glyphicon: 'refresh',
                store: 'translate',
                title: '{refresh}',
                click: $.isFunction(config.refresh)? config.refresh: function () {
                    cb.load('store', config.module, config.store, {action: 'get'});
                }
            }, {
                xtype: 'button',
                glyphicon: 'search',
                store: 'translate',
                title: '{search}'
            }, {
                xtype: 'button',
                type: 'success',
                glyphicon: 'plus',
                store: 'translate',
                text: ' {new}'
            }]
        };
        // Add custon beforeItems
        if (cb.fetchFromObject(config, 'browse.beforeItems')) {
            if (!$.isArray(config.browse.beforeItems)) {
                config.browse.beforeItems = [config.browse.beforeItems];
            }
            config.beforeItems.items = config.beforeItems.items.concat(config.browse.beforeItems);
        }
        opt.body.table.beforeItems = config.beforeItems;
        // Set after table items
        config.afterItems = {
            xtype: 'div',
            pull: 'left',
            padding: '5px 0 0 5px',
            defaults: {
                margin: '0 5px 5px 0'
            },
            items: []
        };
        if (cb.fetchFromObject(config, 'browse.afterItems')) {
            if (!$.isArray(config.browse.afterItems)) {
                config.browse.afterItems = [config.browse.afterItems];
            }
            config.afterItems.items = config.afterItems.items.concat(config.browse.afterItems);
        }
        if (config.afterItems.items.length) {
            opt.body.table.afterItems = config.afterItems;
        }
        // Set store
        opt.store = config.store;
        // Set field of data
        opt.field = config.field;
        // Set head
        opt.head = config.head;
        // Set footer
        opt.footer = config.footer;
        // Set type
        opt.type = config.type;
        // Extends opt
        if (cb.fetchFromObject(config, 'browse.opt')) {
            opt = $.extend(opt, config.browse.opt);
        }
        // Container to tender
        opt.renderTo = config.renderTo;

        cb.create(opt);
    },

    /*----------*\
    |    VIEW    |
    \*----------*/
    view: function (data) {
        var config = cb.cloneObject(this.getFormsConfig(data.name));
        var opt = {
            xtype: 'panel',
            items: []
        };
        var t_head, t_body = [], t_footer;
        // Head, Footer
        if (config.view && config.view.opt) {
            t_head = config.view.opt.head || config.head;
            t_footer = config.view.opt.footer || config.footer;
        } else {
            t_head = config.head;
            t_footer = config.footer;
        }
        // Fields values
        var defStore = cb.getStore(config.defStore);
        for (field in defStore.getData('fields')) {
            if (!config.view || !config.view.fields || config.view.fields.indexOf(field) > -1) {
                var f = defStore.getData('fields')[field];
                t_body.push({
                    xtype: 'form-group',
                    pull: 'left',
                    margin: '0 10px 0 0',
                    items: [{
                        xtype: 'label',
                        text: f['translate']
                    }, {
                        xtype: 'thumbnail',
                        css: {
                            'margin-bottom': 10
                        },
                        text: data.record[field]
                    }]
                });
            }
        }
        t_body = [{
            xtype: 'container',
            type: 'fluid',
            padding: '10px 10px 0',
            items: t_body
        }];
        // Set Head
        opt.items.push({
            xtype: 'head',
            items: t_head
        });
        // Set body
        // Add buttons back, edit
        config.beforeItems = {
            xtype: 'div',
            padding: '5px 0 0 5px',
            css: {
                'border-bottom': '1px solid #DDD'
            },
            defaults: {
                margin: '0 5px 5px 0'
            },
            items: [{
                xtype: 'button',
                glyphicon: 'chevron-left',
                store: 'translate',
                title: '{return}',
                click: function () {
                    cb.ctr('forms', 'browse', data.name);
                }
            }, {
                xtype: 'button',
                type: 'warning',
                store: 'translate',
                glyphicon: 'pencil',
                text: ' {edit}',
                click: function () {
                    cb.ctr('forms', 'edit', data);
                }
            }, {
                xtype: 'button',
                type: 'danger',
                store: 'translate',
                glyphicon: 'erase',
                text: ' {delete}',
                click: function () {

                }
            }]
        };
        // Add custon beforeItems
        if (cb.fetchFromObject(config, 'view.beforeItems')) {
            if (!$.isArray(config.view.beforeItems)) {
                config.view.beforeItems = [config.view.beforeItems];
            }
            config.beforeItems.items = config.beforeItems.items.concat(config.view.beforeItems);
        }
        t_body.unshift(config.beforeItems);
        // Set Fields
        opt.items.push({
            xtype: 'body',
            overflow: 'auto',
            padding: 0,
            items: t_body
        });
        // Set after table items
        config.afterItems = {
            xtype: 'div',
            padding: '5px 0 0 5px',
            css: {
                'border-top': '1px solid #DDD'
            },
            defaults: {
                margin: '0 5px 5px 0'
            },
            items: []
        };
        if (cb.fetchFromObject(config, 'view.afterItems')) {
            if (!$.isArray(config.view.afterItems)) {
                config.view.afterItems = [config.view.afterItems];
            }
            config.afterItems.items = config.afterItems.items.concat(config.view.afterItems);
        }
        if (config.afterItems.items.length) {
            t_body.push(config.afterItems);
        }
        // Set footer
        opt.items.push({
            xtype: 'footer',
            items: t_footer
        });
        // Set type
        opt.type = config.type;
        // Extends opt
        if (cb.fetchFromObject(config, 'view.opt')) {
            opt = $.extend(opt, config.view.opt);
        }
        // Container to tender
        opt.renderTo = config.renderTo;

        cb.create(opt);
    },

    /*----------*\
    |    EDIT    |
    \*----------*/
    edit: function (data) {
        var config = cb.cloneObject(this.getFormsConfig(data.name));
        var opt = {
            xtype: 'panel',
            items: []
        };
        var t_head, t_body = [], t_footer;
        // Head, Footer
        if (config.edit && config.edit.opt) {
            t_head = config.edit.opt.head || config.head;
            t_footer = config.edit.opt.footer || config.footer;
        } else {
            t_head = config.head;
            t_footer = config.footer;
        }
        // Fields values
        var defStore = cb.getStore(config.defStore);
        for (field in defStore.getData('fields')) {
            if (!config.edit || !config.edit.fields || config.edit.fields.indexOf(field) > -1) {
                var f = defStore.getData('fields')[field];
                t_body.push({
                    xtype: 'form-group',
                    pull: 'left',
                    margin: '0 10px 0 0',
                    items: [{
                        xtype: 'label',
                        text: f['translate']
                    }, cb.ctr('forms', 'getInputFromType', {
                        field: field,
                        type: f,
                        value: data.record[field]
                    })]
                });
            }
        }
        t_body = [{
            xtype: 'container',
            type: 'fluid',
            padding: '10px 10px 0',
            items: {
                xtype: 'form',
                name: 'form-edit-' + data.name,
                items: t_body
            }
        }];
        // Set Head
        opt.items.push({
            xtype: 'head',
            items: t_head
        });
        // Set body
        // Add buttons back, edit
        config.beforeItems = {
            xtype: 'div',
            padding: '5px 0 0 5px',
            css: {
                'border-bottom': '1px solid #DDD'
            },
            defaults: {
                margin: '0 5px 5px 0'
            },
            items: [{
                xtype: 'button',
                glyphicon: 'chevron-left',
                store: 'translate',
                title: '{return}',
                click: function () {
                    cb.ctr('forms', 'browse', data.name);
                }
            }, {
                xtype: 'button',
                glyphicon: 'eye-open',
                store: 'translate',
                title: '{view}',
                click: function () {
                    cb.ctr('forms', 'view', data);
                }
            }, {
                xtype: 'button',
                type: 'warning',
                store: 'translate',
                glyphicon: 'floppy-disk',
                text: ' {save}',
                click: function () {
                    cb.ctr('forms', 'save', data);
                }
            }]
        };
        // Add custon beforeItems
        if (cb.fetchFromObject(config, 'edit.beforeItems')) {
            if (!$.isArray(config.edit.beforeItems)) {
                config.edit.beforeItems = [config.edit.beforeItems];
            }
            config.beforeItems.items = config.beforeItems.items.concat(config.edit.beforeItems);
        }
        t_body.unshift(config.beforeItems);
        // Set Fields
        opt.items.push({
            xtype: 'body',
            overflow: 'auto',
            padding: 0,
            items: t_body
        });
        // Set after table items
        config.afterItems = {
            xtype: 'div',
            padding: '5px 0 0 5px',
            css: {
                'border-top': '1px solid #DDD'
            },
            defaults: {
                margin: '0 5px 5px 0'
            },
            items: []
        };
        if (cb.fetchFromObject(config, 'edit.afterItems')) {
            if (!$.isArray(config.edit.afterItems)) {
                config.edit.afterItems = [config.edit.afterItems];
            }
            config.afterItems.items = config.afterItems.items.concat(config.edit.afterItems);
        }
        if (config.afterItems.items.length) {
            t_body.push(config.afterItems);
        }
        // Set footer
        opt.items.push({
            xtype: 'footer',
            items: t_footer
        });
        // Set type
        opt.type = config.type;
        // Extends opt
        if (cb.fetchFromObject(config, 'edit.opt')) {
            opt = $.extend(opt, config.edit.opt);
        }
        // Container to tender
        opt.renderTo = config.renderTo;

        cb.create(opt);
    },

    save: function (data) {
        var config = cb.cloneObject(this.getFormsConfig(data.name));
        cb.send('form-edit-' + data.name, config.module, config.store, function(){
            alert('Formulario enviado');
        });
    },

    getInputFromType: function (data) {
        data.type.type = data.type.type.toUpperCase();
        if (data.type.type == 'ENUM') {
            var input = {
                xtype: 'select',
                items: []
            };
            data.type.values.forEach(function (v) {
                input.items.push({
                    xtype: 'option',
                    value: v,
                    text: v,
                    selected: v === data.value
                });
            });
        } else {
            var input = {
                xtype: 'input',
                value: data.value
            };
            switch (data.type.type) {
                case 'VARCHAR': input.type = 'text';
                    break;
                case 'INT': input.type = 'number';
                    break;
            }
        }
        if (data.type.length) {
            input.maxlength = data.type.length;
        }
        input.placeholder = data.type.translate;
        input.css = {
            'margin-bottom': 10
        };
        input.name = data.field;
        return input;
    }
});