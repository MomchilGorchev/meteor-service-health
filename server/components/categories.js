/**
 * Created by momchillgorchev on 15/11/15.
 * Categories related server methods
 */
Meteor.startup(() => {

    return Meteor.methods({

        /**
         * Saves newly-passed category to the DB
         * @param categories
         */
        saveNewCategories(categories){

            // Validates the input
            check(categories, Array);

            // Iterate over the result
            for(let i = 0, count = categories.length; i < count; i++){

                // [DEBUG]
                //log(categories[i]);

                // Build the new record
                let newC = {
                    name: categories[i],
                    created: Date.now(),
                    owner: Meteor.userId()
                };

                //log(newC);

                // If there is not a category with the same name
                if(Categories.find({name: newC.name}).count() === 0){
                    Categories.insert(newC);
                }
            }
        }
    });
});
