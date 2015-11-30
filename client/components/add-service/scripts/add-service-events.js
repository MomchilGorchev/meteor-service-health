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
            categories: container.find('#selected-list').html(),
            lastStatusCode: null,
            status: null
        };

        // Transform to array, trim the spaces and empty elements;
        newService.categories = newService.categories.split(/[ ,]+/)
            .filter(function(n){ return n.length > 0 });

        console.log(newService);

        //// Simple validation
        if(newService.name.length < 1 || newService.url.length < 1 || newService.categories.length < 1){
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
    'click #category__add-new': function(e, t){

        // Cache elements
        var el = e.currentTarget,
            parentRow = el.closest('.row');


            // If that element is not appended already
            if(!t.find('#new_category_row')){
                // Add the markup to the DOM
                var newField =
                    '<div id="new_category_row" class="row">'+
                        '<div class="input-field col s6">'+
                            '<i class="material-icons prefix">assignment</i>'+
                            '<label for="new_categories" class="textarea-label">Comma separated list of categories</label>'+
                            '<textarea id="new_categories" rows="5" class="materialize-textarea"></textarea>'+
                        '</div>'+
                        '<div id="checkboxes-holder" class="input-field col s6">'+
                            '<button id="save_category_list" class="btn waves-effect waves-light grey darken-1" type="button">'+
                                'Save'+
                            '</button>'+
                            '<button id="reset_category_list" class="btn waves-effect waves-light orange darken-1" type="button">'+
                                'Reset'+
                            '</button>'+
                        '</div>'+
                    '</div>';
                parentRow.insertAdjacentHTML('afterend', newField);
            }

    },

    /**
     * Add the category to the selected list when checkbox is checked
     */
    'change .category__checkbox': function(e, t){

        var trigger = e.currentTarget,
            categoryName = trigger.parentNode.querySelector('label').innerHTML;


        // Select elements
        var displayBox = document.querySelector('#categories-selected'),
            displaySlot = displayBox.querySelector('.selected__list'),
            alreadyAdded = displaySlot.innerHTML;

        // Check if the service is not selected already
        if(alreadyAdded.indexOf(categoryName) === -1){
            // If not add its name to the list
            displaySlot.innerHTML += ' '+ categoryName +' ';
        } else {
            // Else erase it from the list
            displaySlot.innerHTML = alreadyAdded.replace(categoryName, '');
        }

    },

    // If i decide to implement 'turn-into-a-label' functionaliry
    // when comma is pressed
    //'keyup #new_categories': function(e, t){
    //
    //    console.log(e.keyCode);
    //    // keyCode 188 = comma
    //
    //},

    /**
     * Save - for new categories
     * @param e
     * @param t
     */
    'click #save_category_list': function(e, t){

        // Cache elements
        var trigger = e.currentTarget,
            parentCol = trigger.parentNode,
            parentRow = parentCol.parentNode,
            textArea = parentRow.querySelector('#new_categories'),
            value = textArea.value,
            selectDropdown = t.find('#service_category');

        //log(textArea);

        // Validate the inut
        if(!value || value.length < 2){
            Materialize.toast('Please specify at least one category', 3000);
        } else {

            // Read the list from the text area
            var catList = value.split(/[ ,]+/);

           Meteor.call('saveNewCategories', catList, function(err, res){
               // Show message toast based on the response
               err ? Materialize.toast('Error: '+ err.message , 3000)
                   : Materialize.toast('Categories saved!', 3000);
                     $('#reset_category_list').trigger('click');
           });

        }
    },

    /**
     * Reset new category form
     */
    'click #reset_category_list': function(e, t){

        $(e.currentTarget)
            .closest('#new_category_row')
            .find('#new_categories')
            .val('');
    },
});