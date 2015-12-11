/**
 * Created by momchillgorchev on 22/05/15.
 */


Meteor.startup(function(){

    /**
     * Read JSON data into collection
     * require const filename: EP_DETAILS.json
     * Only if there is user logged in as the
     * endpoints requires userID as owner field
     */
    if(this.userId){
        (function readJSONFile(){
            var JSONData = '';
            try{
                // Try to read file
                JSONData = JSON.parse(Assets.getText(core.JSON_FILENAME));
                console.log('Loading JSON file...');

                // Iterate over
                for(var i = 0; i < JSONData.length; i++){
                    var current = JSONData[i];

                    // Add every record to the DB
                    // addEndpoint method checks for duplicates and validate the data
                    Meteor.call('addEndpoint', current, function(err, res){
                        log(err ? err : res);
                    });
                }

                // Init check
                Meteor.call('checkServicesStatus');

            } catch(e){
                console.log(e);
            }
        }());
    }


});