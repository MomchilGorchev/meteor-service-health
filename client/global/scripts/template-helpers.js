/**
 * Created by momchillgorchev on 20/10/15.
 */

Template.registerHelper('endpoints', function(){
    //console.log(Endpoints.find({}, {sort: {order: -1}}));
    return Endpoints.find();
});

Template.registerHelper('endpointsCount', function(){
    return Endpoints.find().count();
});

Template.registerHelper('equals', function (a, b) {
    return a === b;
});