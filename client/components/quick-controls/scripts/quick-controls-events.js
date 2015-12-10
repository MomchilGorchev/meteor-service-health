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

        var trigger = $(e.currentTarget),
            parent = trigger.closest('#save__order');

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

            // Display the result in a toast and hide the buttons
            if(err || res.error){
                Materialize.toast('Error: '+ err.message , 3000);
                parent.removeClass('enabled');
            } else {
                Materialize.toast('Services order saved!' , 3000);
                parent.removeClass('enabled');
            }
        });
    },

    'click .pagination__control:not(".disabled")': function(e, t){

        log('ops');
        var trigger = $(e.currentTarget),
            parent = $('#index-cards-holder'),
            cards = parent.find('.card__wrapper').toArray();

        var first = +$(cards[0]).attr('data-order'), newFirst;
        var last = +$(cards.pop()).attr('data-order'), newLast;

        //console.log('first -> ', first);
        //console.log('last -> ', last);

        // Going back
        if(trigger.hasClass('prev')){

            // We are sure we are not on the last page
            // as we going backwards
            Session.set('lastPage', false);

            // Do the math
            newFirst = first - 1 - Session.get('paginationItemsPerPage');
            newLast = first - 1;

            // And set the right indexes
            Session.set('paginationFirstIndex', newFirst);
            Session.set('paginationLastIndex', newLast);

            // If we are on the first page
            // set the flag to disable the left arrow
            if(newFirst === 0){
                Session.set('firstPage', true);
            }

        } else {

            // Get fresh DB count
            var eps = Endpoints.find().count();

            // We know we are not on the first page
            // as we going forward
            Session.set('firstPage', false);

            // Do the math
            newFirst = last;
            newLast = last + Session.get('paginationItemsPerPage');

            // Do the math and set the right indexes
            Session.set('paginationFirstIndex', newFirst);
            Session.set('paginationLastIndex', newLast);

            // If we reached the last page
            // set the flag to disable right arrow
            if(newLast === eps){
                Session.set('lastPage', true);
            }

        }


    }

});












