cb.define({
    xtype: 'controller',
    name: 'main',

    route: {
        '#app/:str': 'openApp',
        '#desktop': 'closeAllApps'
    },

    apps: [],
    
    onload: function () {
        cb.setConfig('lang', 'es');
        cb.loadAll([
            ['controller', 'main', 'forms'],
            ['component', 'main', 'menubar'],
            ['component', 'main', 'desktop'],
            ['component', 'main', 'forms'],
            ['store', 'main', 'translate'],
            ['view', 'main', 'main']
        ], function () {
            cb.router.hashchange();
        });
    },

    openApp: function (hash) {
        if (cb.getCmp('app-' + hash[1])) {
            cb.getCmp('app-' + hash[1]).show();
        } else {
            console.log('Opening app ' + hash[1]);
            this.closeAllApps();
            this.renderAppContainer(hash[1]);
            // Load controller of app
            cb.load('controller', hash[1], hash[1]);
        }
    },

    renderAppContainer: function(name) {
        cb.create({
            xtype: 'app-' + name,
            renderTo: 'desktop'
        });
        this.apps.push('app-' + name)
    },

    closeAllApps: function () {
        this.apps.forEach(function (c) {
            cb.getCmp(c).hide();
        });
    }
});