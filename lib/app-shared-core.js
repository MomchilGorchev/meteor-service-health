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
                        if(err){
                            Materialize.toast('An error occurred: '+ err.reason , 3000);

                        } else {
                            Materialize.toast('File processed successfully! Created: '+ res.created +' Already existing: '+ res.existing +' Invalid: '+ res.invalid , 6000);
                        }
                    });
                });
            }
        };


        Session.set('reloading', false);

        // Pagination
        Session.set('firstPage', true);
        Session.set('lastPage', false);

        // Get Endpoints count and calculate pagination settings based on that
        Meteor.call('getEpsCount', function(err, res){
            // Should never return error, but however
            if(err){
                console.log('Error:', err);
            } else {
                //console.log(res);
                // When we got the actual data
                Session.set('EpsCount', res);

                //Only if there are some records in the DB
                if(Session.get('EpsCount') > 0){

                    // Assign some variables to manage pagination
                    Session.set('sorting', 1);
                    Session.set('paginationItemsPerPage',  Session.get('EpsCount') < 5 ? Session.get('EpsCount') : 5);
                    Session.set('paginationFirstIndex', 1);
                    Session.set('paginationLastIndex', Session.get('paginationItemsPerPage'));

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



