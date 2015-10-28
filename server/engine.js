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
            JSONData = JSON.parse(Assets.getText(core.JSON_FILENAME));
            console.log('Loading JSON file...');

            for(var i = 0; i < JSONData.length; i++){
                var current = JSONData[i];

                var endPoint = Endpoints.find({url: current.url}, {}).fetch();
                if(!endPoint.length){
                    //console.log('Adding [ '+ current.name + ' ] to the database...');
                    Endpoints.insert(current);
                }
                else {
                    //console.log('Service '+ current.name + ' already added... Moving on...');
                }
            }

        } catch(e){
            console.log(e);
        }
    }());

});