cb.define({
    xtype: 'view',
    name: 'main',
    renderTo: 'app-user',
    onRender: function () {
        console.log('User view rendered!');
    },
    items: {
        xtype: 'forms',
        head: {
            text: 'Usuarios'
        }
    }
});