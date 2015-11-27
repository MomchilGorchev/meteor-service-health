/**
 * Created by momchillgorchev on 20/10/15.
 */

Template.registerHelper('endpoints', function(){
    return Endpoints.find({}, {sort: {order: -1}});
});

/**
 * Fetch all endpoints and check they last status
 */
Template.registerHelper('endpointsCount', function(){
    // Fetch the data once
    var allData = Endpoints.find().fetch(),
        buffer = {
            green: 0,
            red: 0,
            orange: 0
        };

    // Iterate over the data and check the status color code
    for(var i = 0, count = allData.length; i < count; i++){
        var current = allData[i];

        if(current.status === 'green'){
            buffer.green++;
        } else if(current.status === 'orange'){
            buffer.orange++;
        } else {
            buffer.red++;
        }
    }

    // Calculate the total amount of processed entries
    // if there is an entry with no field (bad data), it wont be considered
    buffer.total = buffer.green + buffer.red + buffer.orange;
    return buffer;

});

Template.registerHelper('catData', function(){
    return Categories.find();
});

Template.registerHelper('currentlyReloading', function(){
    return Session.get('reloading');
});

Template.registerHelper('equals', function (a, b) {
    return a === b;
});

