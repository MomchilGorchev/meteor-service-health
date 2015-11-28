/**
 * Created by momchillgorchev on 27/11/15.
 */


Template.home.rendered = function(){

    var dnd = dragula([document.querySelector('#index-cards-holder')], {

        // Only draggable with the handle
        moves: function (el, container, handle) {
            return $(handle).hasClass('handle');
        }

    });

    // Events of the dragging process
    dnd.on('drag', function(el, source){

        // Show the "save" button
        var saveOrderBtn = $('#save__order');
        if(!saveOrderBtn.hasClass('enabled')){
            saveOrderBtn.addClass('enabled');
        }

    });
};