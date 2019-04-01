cb.define({
    xtype: 'controller',
    name: 'user',
    
    onload: function () {
        //alert('Controller loaded!')
        cb.loadAll([
            ['store', 'user', 'user', {action: 'get'}],
            ['view', 'user', 'user']
        ], function () {
            
        });
    }
});