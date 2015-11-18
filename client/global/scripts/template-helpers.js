/**
 * Created by momchillgorchev on 20/10/15.
 */

Template.registerHelper('endpoints', function(){
    return Endpoints.find({}, {sort: {order: -1}});
});

Template.registerHelper('endpointsCount', function(){
    return Endpoints.find().count();
});

Template.registerHelper('endpointsGreenCount', function(){
    return Endpoints.find({"lastStatusCode": 200}).count();
});

Template.registerHelper('equals', function (a, b) {
    return a === b;
});