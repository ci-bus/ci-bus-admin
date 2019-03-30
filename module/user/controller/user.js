cb.define({
    xtype: 'controller',
    name: 'user',
    
    onload: function () {
        //alert('Controller loaded!')
        cb.loadAll([
            //['view', 'common', 'base'],
            ['store', 'user', 'user', {action: 'get'}],
            //['view', 'user', 'main']
        ], function () {
            
        });
    }
});