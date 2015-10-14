
describe("Meteor core check...", function() {

    it('Meteor.isServer is initiated', function(){
        expect(Meteor.isServer).toBeDefined();
    });

    it("Router should be defined", function() {
        expect(Meteor.methods).toBeTruthy();
        expect(Meteor.methods).toBeDefined();
    });

    it("Meteor.methods should be defined and returns object with function/methods", function() {
        expect(Meteor.methods).toBeTruthy();
        expect(Meteor.methods).toBeDefined();
        expect(Meteor.methods.length).toBeGreaterThan(0);
    });

});