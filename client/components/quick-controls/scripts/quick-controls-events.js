/**
 * Created by momchillgorchev on 28/11/15.
 */


Template.quickControls.events({

    /**
     * No save of the new order - hide the element
     */
    'click #no-save': function(e, t){
        e.preventDefault();

        var trigger = $(e.currentTarget),
            parent = trigger.closest('#save__order');
        parent.removeClass('enabled');
    },

    /**
     * Grab and saves all visible items with new order
     */
    'click #yes-save': function(e, t){
        e.preventDefault();

        // Cache elements
        var cards = $('.card'),
            newOrderList = [];

        // Iterate and match the store the itemId with the
        // corresponding position
        for(var i = 0, count = cards.length; i < count; i++){

            var current = cards[i];

            // Push to an array to be sent to the server
            newOrderList.push({
                itemId: current.getAttribute('data-itemid'),
                newOrder: count - i
            });
        }

        // TODO maybe we can do this functionality on every drag/drop

        // Call the service with the prepared data
        Meteor.call('updateEndpointsOrder', newOrderList, function(err, res){
            err ? Materialize.toast('Error: '+ err.message , 3000)
                : Materialize.toast('Services order saved!' , 3000);
        });
    }

});