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

    dnd.on('drag', function(el, source){

        var saveOrderBtn = $('#save__order');
        if(saveOrderBtn.hasClass('hidden')){
            saveOrderBtn.removeClass('hidden');
        }
        console.log('Started dragging');

    });

};