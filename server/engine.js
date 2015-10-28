/**
 * Created by momchillgorchev on 22/05/15.
 */


Meteor.startup(function(){

    /**
     * Read JSON data into collection
     * require const filename: EP_DETAILS.json
     */
    (function readJSONFile(){
        var JSONData = '';
        try{
            // Try to read file
            JSONData = JSON.parse(Assets.getText(core.JSON_FILENAME));
            console.log('Loading JSON file...');

            // Iterate over
            for(var i = 0; i < JSONData.length; i++){
                var current = JSONData[i];

                // Select by URL (preventing doubled entries)
                var endPoint = Endpoints.find({url: current.url}, {}).fetch();
                if(!endPoint.length){
                    // Insert
                    Endpoints.insert(current);
                }
            }

        } catch(e){
            console.log(e);
        }
    }());

});