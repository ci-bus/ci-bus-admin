cb.define({
    xtype: 'component',
    name: 'menubar',
    items: [{
        xtype: 'nav',
        type: 'default static-top',
        margin: 0,
        items: [{
			xtype: 'header',
			items: [{
				xtype: 'a',
				padding: '1px 0px 1px 10px',
				css: {cursor: 'pointer'},
				cls: 'navbar-brand',
				href: '#desktop',
				items: [{
				    xtype: 'img',
				    src: './assets/img/cb_logo.png',
				    width: 48,
				    float: 'left'
				}]
			}]
		}, {
            xtype: 'collapse',
            items: [{
                xtype: 'navbar',
                type: 'left',
                items: [{
                    xtype: 'dropdown',
                    store: 'translate',
                    text: ' {apps} ',
                    items: [{
                        xtype: 'a',
                        href: '#app/user',
                        items: [{
                            xtype: 'glyphicon',
                            type: 'user'
                        }, {
                            xtype: 'spam',
                            store: 'translate',
                            text: ' {users}'
                        }]
                    }, {
                        xtype: 'divider'
                    }, {
                        xtype: 'a',
                        text: 'Separated link'
                    }]
                }]
            }, {
                xtype: 'navbar',
                type: 'right',
                items: [{
                    xtype: 'a',
                    glyphicon: 'off',
                    color: 'RED'
                }]
            }]
        }]
    }]
});