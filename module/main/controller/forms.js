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
                click: $.isFunction(config.refresh)? config.refresh: function () {
                    cb.load('store', config.module, config.store, {action: 'get'});
                }
            }, {
                xtype: 'button',
                glyphicon: 'search'
            }, {
                xtype: 'button',
                type: 'success',
                glyphicon: 'plus',
                store: 'translate',
                text: ' {new}'
            }]
        };
        // Add custon beforeItems
        if (config.browse.beforeItems) {
            if (!$.isArray(config.browse.beforeItems)) {
                config.browse.beforeItems = [config.browse.beforeItems];
            } else {
                config.browse.beforeItems = config.browse.beforeItems;
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
        if (config.browse.afterItems) {
            if (!$.isArray(config.browse.afterItems)) {
                config.browse.afterItems = [config.browse.afterItems];
            } else {
                config.browse.afterItems = config.browse.afterItems;
            }
            config.afterItems.items = config.afterItems.items.concat(config.browse.afterItems);
        }
        opt.body.table.afterItems = config.afterItems;
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
        if (config.browse.opt) {
            opt = $.extend(opt, config.browse.opt);
        }
        // Container to tender
        opt.renderTo = config.renderTo;

        cb.create(opt);
    },

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
        t_body = [{
            xtype: 'container',
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
                text: ' {return}',
                click: function () {
                    cb.ctr('forms', 'browse', data.name);
                }
            }, {
                xtype: 'button',
                type: 'warning',
                glyphicon: 'refresh',
                store: 'translate',
                glyphicon: 'pencil',
                text: ' {edit}',
                click: function () {

                }
            }, {
                xtype: 'button',
                type: 'danger',
                glyphicon: 'refresh',
                store: 'translate',
                glyphicon: 'erase',
                text: ' {delete}',
                click: function () {

                }
            }]
        };
        // Add custon beforeItems
        if (config.view.beforeItems) {
            if (!$.isArray(config.view.beforeItems)) {
                config.view.beforeItems = [config.view.beforeItems];
            } else {
                config.view.beforeItems = config.view.beforeItems;
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
        if (config.view.afterItems) {
            if (!$.isArray(config.view.afterItems)) {
                config.view.afterItems = [config.view.afterItems];
            } else {
                config.view.afterItems = config.view.afterItems;
            }
            config.afterItems.items = config.afterItems.items.concat(config.view.afterItems);
        }
        t_body.push(config.afterItems);
        // Set footer
        opt.items.push({
            xtype: 'footer',
            items: t_footer
        });
        // Set type
        opt.type = config.type;
        // Extends opt
        if (config.view.opt) {
            opt = $.extend(opt, config.view.opt);
        }
        // Container to tender
        opt.renderTo = config.renderTo;

        cb.create(opt);
    }
});