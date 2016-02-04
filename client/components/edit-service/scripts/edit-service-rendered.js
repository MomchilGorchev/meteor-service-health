/**
 * Created by momchillgorchev on 20/10/15.
 */

Template.editServiceEndpoint.rendered = function(){
    $('select').material_select();
};

Template.editServicesGrid.rendered = function(){

    var dnd = dragula([document.querySelector('#edit-cards-holder')], {

        // Only draggable with the handle
        moves: function (el, container, handle) {
            return $(handle).hasClass('handle');
        }

    });

};