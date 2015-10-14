
describe("Check for template existence...", function() {

    var templates = [
        'home', 'addServiceEndpoint', 'editServiceEndpoint'
    ];

    templates.forEach(function(temp){
        it('Template should exist: ['+ temp + ']', function(){
            expect(Template[temp]).toBeDefined();
            expect(Template[temp]).toBeTruthy();
        });

        it('Template ['+ temp +'] helpers should exist', function(){
            expect(Template[temp].helpers).toBeDefined();
            expect(Template[temp].helpers).toBeTruthy();
        });
    })

});