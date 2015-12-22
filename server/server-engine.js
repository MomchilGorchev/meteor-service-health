/**
 * Created by momchillgorchev on 22/05/15.
 */


Meteor.startup(function(){

    Meteor.methods({

        /**
         * Read JSON data into collection
         * require const filename: EP_DETAILS.json
         * Only if there is user logged in as the
         * endpoints requires userID as owner field
         */
        readJSONFile:function(userId){

            console.log('Read file called with: ', userId);
            var uId = userId || 'shared';
            var JSONData = '';

            try{

                console.log('\n\nReading data for: '+ userId +'\n\n');
                // Try to read file
                JSONData = JSON.parse(fs.readFileSync(baseUrl + '/.uploads/userfiles/'+ userId +'-'+ core.JSON_FILENAME, 'utf8')); //Get the current user folder
                console.log('Loading JSON file...');

                // Iterate over
                for(var i = 0; i < JSONData.length; i++){
                    var current = JSONData[i];

                    // Pass the owner userID as well
                    var requestData = {
                        owner: userId,
                        data: current
                    };

                    // Add every record to the DB
                    // addEndpoint method checks for duplicates and validate the data
                    // Also ping the endpoint to check the initial status
                    Meteor.call('addEndpoint', requestData, function(err, res){
                        log(err ? err : res);
                    });
                }

                return true;

            } catch(e){
                console.log(e);
                return false;
            }
        },

        getUserId: function(){

            return Meteor.userId();
        }

    });


});