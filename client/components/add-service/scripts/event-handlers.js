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
                        '<div class="input-field col s6">'+
                            '<p>'+
                                '<input type="checkbox" id="add_to_current" checked="checked" />'+
                                '<label for="add_to_current">Add to the current</label>'+
                            '</p>'+
                            '<p>'+
                                '<input type="checkbox" id="save_for_later" checked="checked" />'+
                                '<label for="save_for_later">Save for later use</label>'+
                            '</p>' +
                            '<br />'+
                            '<button id="save_category_list" class="btn waves-effect waves-light grey darken-1" type="button">'+
                                'Save'+
                            '</button>'+
                        '</div>'+
                    '</div>';
                parentRow.insertAdjacentHTML('afterend', newField);
            }
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
            selectDropdown = t.find('#service_category');

        //log(textArea);

        // Validate the inut
        if(!textArea.value || textArea.value.length < 2){
            Materialize.toast('Please specify at least one category', 3000);
        } else {

            // Read the list from the text area
            var catList = textArea.value.split(/[ ,]+/),
                checkBoxes = {
                    addToCurrent: parentCol.querySelector('#add_to_current').checked,
                    saveForLater: parentCol.querySelector('#save_for_later').checked
                };

            //log(catList);
            //log(checkBoxes);

            // If add to current is selected
            if(checkBoxes.addToCurrent){

                // TEMP - TODO implement nice display of the categories
                var catDisplay = document.createElement('p');
                catDisplay.innerHTML = '<p>'+ textArea.value +'</p>';
                parentRow.appendChild(catDisplay);
            }

            // If Save checkbox is checked
            // send the list to be saved in the DB
            if(checkBoxes.saveForLater){
               Meteor.call('saveNewCategories', catList, function(err, res){
                   // Show message toast based on the response
                   err ? Materialize.toast('Error: '+ err.message , 3000)
                       : Materialize.toast('Categories saved!', 3000);
                        // Temp - re-init the select, not good as the arrow gets appended again
                        // Needs another way of displaying
                         $(selectDropdown).material_select();
               });
            }
        }
    }
});
