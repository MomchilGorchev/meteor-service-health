/**
 * Created by momchillgorchev on 22/05/15.
 * Reusable, global function declarations
 */

Meteor.startup(function(){

    log = function(message){
        console.log(message);
    };

    if(Meteor.isClient){

        // Configure Dropzone
        Meteor.Dropzone.options = {
            // The text in the box
            dictDefaultMessage: '<p>JSON</p> Drop files to upload',
            init: function() {

                // On file upload complete call the method to read the file
                this.on("complete", function(file) {

                    //TODO Extend to include visual feedback

                    Meteor.call('readJSONFile', function(err, res){

                        //TODO implement better error handling
                        log(err ? 'Error: '+ err : 'Response: '+ res);
                    });
                });
            }
        };


        Session.set('reloading', false);

        // Pagination
        Session.set('firstPage', true);
        Session.set('lastPage', false);

        Tracker.autorun(function(c){
            var eps = ReactiveMethod.call('getEpsCount');
            console.log(eps);

            if(eps !== undefined){

                Session.set('sorting', 1);
                Session.set('paginationItemsPerPage',  eps < 9 ? eps : 9);
                Session.set('paginationFirstIndex', 0);
                Session.set('paginationLastIndex', Session.get('paginationItemsPerPage'));
                c.stop();
            }
        });
        // TODO  needs another way of doing it,




        // Only if there are some records in the DB
        //if(eps > 0){
        //    // Assign a call every minute
        //    // To be extended when specifying a frequency
        //    // of the calls is implemented
        //    Meteor.setInterval(function(){
        //
        //        log('Reloading...');
        //
        //        // This needs to be tested if it really keeps
        //        // the session var true while calling the endpoints
        //        Session.set('reloading', true);
        //
        //        Meteor.call('checkServicesStatus', function(err, res){
        //
        //            Session.set('reloading', false);
        //        });
        //
        //    }, 1000 * 60);
        //}
    }

    // Leave this call here, as they might be a case
    // to read the file on login
    //
    //else if(Meteor.isServer) {
    //    Accounts.onLogin(function(){
    //
    //        log('onLogin called..');
    //        var uID = Meteor.userId();
    //        Meteor.call('readJSONFile', uID, function(err, res){
    //            console.log(err ? 'Error: '+ err : 'Success: '+ res);
    //        });
    //
    //    });
    //}
});



