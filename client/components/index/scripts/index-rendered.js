/**
 * Created by momchillgorchev on 27/11/15.
 */


Template.home.rendered = function(){

    var dnd = dragula([document.querySelector('#index-cards-holder')]);

    dnd.on('drag', function(el, source){

        var saveOrderBtn = $('#save__order');
        if(saveOrderBtn.hasClass('hidden')){
            saveOrderBtn.removeClass('hidden');
        }
        console.log('Started dragging');

    });

};