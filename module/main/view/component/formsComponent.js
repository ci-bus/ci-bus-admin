cb.define({
    xtype: 'component',
    name: 'forms',
    ctype: 'grid',
    type: 'primary',

    record: [{
        name: 'Miguel',
        lastname: 'Calero',
        type: 'Root',
        date: '2018-05-01'
    }, {
        name: 'Miguel',
        type: 'Root',
        date: '2018-05-06',
        ctype: 'info'
    }, {
        name: 'María',
        lastname: 'González',
        type: 'Admin',
        date: '2018-05-06'
    }, {
        name: 'Agustín',
        type: 'User',
        date: '2018-05-03'
    }, {
        name: 'Francisca',
        type: 'User',
        date: '2018-05-04'
    }],
    alterdata: {
        'date': function (date) {
            var d = new Date(date);
            return d.getDate() + '/' + (d.getMonth()+1) + '/' + d.getFullYear();
        }
    },

    columns: [{
        name: 'Name',
        text: '{name} {lastname}',
        type: '{ctype}'
    }, {
        name: 'Type',
        text: '{type}',
        type: '{ctype}'
    }, {
        name: 'Date',
        text: '{date}',
        type: '{ctype}'
    }],
    
    head: {
        text: 'App'
    },
    body: {
        css: {
            overflow: 'auto'
        },
        table: {
            type: 'hover',
            border: '1px solid #DDD',
            beforeItems: {
                xtype: 'div',
                text: 'Item text before',
                padding: 5,
                background: '#f2f5f7'
            },
            afterItems: {
                xtype: 'div',
                text: 'Item text after',
                padding: 5,
                background: '#fafafa'
            }
        }
    },
    footer: {
        text: 'Footer content'
    }
});