/**
 * Created by momchillgorchev on 22/05/15.
 */

Template.registerHelper('endpoints', function(){
    return Endpoints.find();
});

Template.registerHelper('endpointsCount', function(){
    return Endpoints.find().count();
});