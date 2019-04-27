cb.define({
    xtype: 'store',
    name: 'translate',
    data: {
        'lang': ['en', 'es'],
        'apps': ['Applications', 'Aplicaciones'],
        'users': ['Users', 'Usuarios'],
        'new': ['New', 'Nuevo'],
        'back': ['Back', 'Atrás'],
        'edit': ['Edit', 'Editar'],
        'return': ['Return', 'Volver'],
        'delete': ['Delete', 'Eliminar'],
        'search': ['Search', 'Buscar'],
        'refresh': ['Refresh', 'Recargar'],
        'view': ['View', 'Ver'],
        'save': ['Save', 'Guardar']
    },
    onload: function () {
        cb.getStore('translate').setRestoreData(this.data);
        this.setLang(cb.getConfig('lang'));
    },
    setLang: function (lang) {
        var i = this.data.lang.indexOf(lang),
            store = cb.getStore('translate'),
            data = store.getRestoreData(),
            fdata = {};
        for (k in data) {
            fdata[k] = data[k][i] || data[k][0] || k;
        }
        store.setData(fdata);
    }
});