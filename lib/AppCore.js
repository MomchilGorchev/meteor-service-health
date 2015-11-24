/**
 * Created by momchillgorchev on 22/05/15.
 * Reusable, global function declarations
 */

Meteor.startup(function(){

    log = function(message){
        console.log(message);
    };

    if(Meteor.isClient){

        Session.set('reloading', false);

        // Assign a call every minute
        // To be extended when specifying a frequency
        // of the calls is implemented
        Meteor.setInterval(function(){

            log('Reloading...');

            // This needs to be tested if it really keeps
            // the session var true while calling the endpoints
            Session.set('reloading', true);

            Meteor.call('checkServicesStatus');

            Session.set('reloading', false);

        }, 1000 * 60);

    }

});



