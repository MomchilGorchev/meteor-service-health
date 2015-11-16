/**
 * Created by momchillgorchev on 20/10/15.
 */

Template.addServiceEndpoint.helpers({

    catData: function(){
        return Categories.find();
    }

});