/**
 * Created by momchillgorchev on 15/11/15.
 * Categories related server methods
 */



Meteor.startup(function() {

    return Meteor.methods({

        saveNewCategories: function(categories){

            check(categories, Array);

            for(var i = 0, count = categories.length; i < count; i++){

                log(categories[i]);

                // TODO - save to collection

            }

        }

    });

});
