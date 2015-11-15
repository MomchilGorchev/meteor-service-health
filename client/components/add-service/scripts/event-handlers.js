/**

 * Created by momchillgorchev on 20/10/15.
 */

Template.addServiceEndpoint.events({
    /**
     * Submit New Service form
     * @param e
     * @param t
     */
    'submit #createNewService': function(e, t){
        e.preventDefault();

        // Cache variables
        var container = $(e.currentTarget),
            newService = {
            name: container.find('#service_name').val(),
            url: container.find('#service_url').val(),
            info: container.find('#service_info').val(),
            category: container.find('#service_category').val(),
            lastStatusCode: null,
            status: null
        };

        // Simple validation
        if(newService.name.length < 1 || newService.url.length < 1 || newService.category.length < 1){
            Materialize.toast('You need to fill all the fields!', 3000);
        } else {
            // If all good, call the server
            Meteor.call('addEndpoint', newService, function(err, res){
                // Display message based on the response
                err ? Materialize.toast('Error: '+ err.message , 3000)
                    : Materialize.toast('Service '+ newService.name + ' successfully added!', 3000);
            });
        }
    },

    /**
     * Insert new input filed when "Create category" is selected
     * from the category select menu
     * @param e
     * @param t
     */
    'change #service_category': function(e, t){

        // Cache elements
        var el = e.currentTarget,
            value = el.value,
            parentRow = el.closest('.row');

        // If create selected
        if(value === 'create'){

            // Add the markup to the DOM
            var newField =
                '<div class="row">'+
                    '<div class="input-field col s10">'+
                        '<i class="material-icons prefix">assignment</i>'+
                        '<label for="new_categories">Comma separated list of categories</label>'+
                        '<textarea id="new_categories" class="materialize-textarea"></textarea>'+
                    '</div>'+
                    '<div class="input-field col s2">'+
                        '<button class="btn waves-effect waves-light" type="submit" name="action">'+
                            '<i class="material-icons">cloud_upload</i>'+
                        '</button>'+
                    '</div>'+
                '</div>';
            parentRow.insertAdjacentHTML('afterend', newField);
        }
    }
});
