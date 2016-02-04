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

    /**
     * Pagination controls
     * Use real DB data to calculate active (viewed) items
     */
    'click .pagination__control:not(".disabled")': function(e, t){

        // Cache all elements needed
        var trigger = $(e.currentTarget),
            parent = $('#index-cards-holder'),
            cards = parent.find('.card__wrapper').toArray(),
            first = +$(cards[0]).attr('data-order'),
            last = +$(cards.pop()).attr('data-order'),
            newFirst, newLast;

        // Going back - e.g. LEFT arrow clicked
        if(trigger.hasClass('prev')){

            // We are sure we are not on the last page
            // as we going backwards
            Session.set('lastPage', false);

            // Do the math
            newFirst = first - Session.get('paginationItemsPerPage');
            newLast = first - 1;

            // Check if the newly calculated first index is not 1
            // e.g on the first page
            if(newFirst <= 1){
                Session.set('firstPage', true);
                newFirst = 1;
            }

            // And set the right indexes
            Session.set('paginationFirstIndex', newFirst);
            Session.set('paginationLastIndex', newLast);

        // Going forward - e.g RIGHT arrow clicked
        } else {

            // We know we are not on the first page
            // as we going forward
            Session.set('firstPage', false);

            // Do the math
            newFirst = last + 1;

            // If the new first item is the last item in the collection
            if(newFirst >= +Session.get('EpsCount')){
                newLast = newFirst;

            // Else try to build full page
            } else {
                newLast = last + Session.get('paginationItemsPerPage');
            }

            // If not enough items for a full page
            // We are on the last page
            if(newLast >= Session.get('EpsCount')) {
                Session.set('lastPage', true);
                newLast = Session.get('EpsCount');
            }

            // Set the right indexes
            Session.set('paginationFirstIndex', newFirst);
            Session.set('paginationLastIndex', newLast);

        }

        // [DEBUG]
        //console.log('paginationFirstIndex is: '+ Session.get('paginationFirstIndex'));
        //console.log('paginationLastIndex is: '+ Session.get('paginationLastIndex'));
        //console.log('paginationItemsPerPage is: '+ Session.get('paginationItemsPerPage'));
        //console.log('EpsCount is: '+ Session.get('EpsCount'));
    }
});












