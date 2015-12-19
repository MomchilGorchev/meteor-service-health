/**
 * Created by momchillgorchev on 22/05/15.
 * Reusable, global function declarations
 */

Meteor.startup(function(){

    log = function(message){
        console.log(message);
    };

    Accounts.onLogin(function(){

        var uID = Meteor.userId();
        Meteor.call('readJSONFile', uID, function(err, res){
            console.log(err ? 'Error: '+ err : 'Success: '+ res);
        });

    });

    if(Meteor.isClient){

        Session.set('reloading', false);

        // Pagination
        Session.set('firstPage', true);
        Session.set('lastPage', false);
        //Session.set('endpointsAmount', Endpoints.find().count());
        //log(Session.get('endpointsAmount'));

        Session.set('sorting', 1);

        Session.set('paginationItemsPerPage', 9);

        Session.set('paginationFirstIndex', 0);
        Session.set('paginationLastIndex', Session.get('paginationItemsPerPage'));


        var eps = Endpoints.find().count();

        // Only if there are some records in the DB
        if(eps > 0){
            // Assign a call every minute
            // To be extended when specifying a frequency
            // of the calls is implemented
            Meteor.setInterval(function(){

                log('Reloading...');

                // This needs to be tested if it really keeps
                // the session var true while calling the endpoints
                Session.set('reloading', true);

                Meteor.call('checkServicesStatus', function(err, res){

                    Session.set('reloading', false);
                });

            }, 1000 * 60);
        }
    }
});



