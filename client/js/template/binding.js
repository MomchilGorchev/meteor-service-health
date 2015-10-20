/**
 * Created by momchillgorchev on 22/05/15.
 */

Template.registerHelper('endpoints', function(){
    return Endpoints.find({}, {sort: {order: 1}});
});

Template.registerHelper('endpointsCount', function(){
    return Endpoints.find().count();
});