/**
 * Created by momchillgorchev on 22/05/15.
 * Reusable, global function declarations
 */

Meteor.startup(function(){

    // Test function to abstract console.log();
    log = function(message){
        console.log(message);
    };

    // Session work only on the client
    if(Meteor.isClient){

        // Utility UI flags
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
                    Session.set('paginationItemsPerPage',  Session.get('EpsCount') < 6 ? Session.get('EpsCount') : 6);
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

                        // Init call sequence
                        Meteor.call('checkServicesStatus', function(err, res){

                            // When call sequence ended hide the loader
                            Session.set('reloading', false);
                        });

                    // 2 minute interval
                    }, 1000 * 120);
                }
            }
        });

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
    }
});



