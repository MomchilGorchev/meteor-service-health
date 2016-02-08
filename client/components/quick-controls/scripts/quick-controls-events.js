/**
 * Created by momchillgorchev on 28/11/15.
 */


Template.quickControls.events({

    /**
     * Manual refresh of all services
     */
    'click .refresh-list': function(e, t) {

        var trigger = $(e.currentTarget),
            icon = trigger.find('.material-icons');
        icon.addClass('rotating');

        // Call server method
        Meteor.call('checkServicesStatus', function (err, res) {
            err ? Bert.alert('Error: '+ err.message , 'danger')
                : Bert.alert('Services list successfully reloaded!', 'success');

            icon.removeClass('rotating');
        });
    },

    /**
     * Quick and dirty filter,
     * checks only the name and URL
     */
    'keyup #search': function(e, t){
        var filter = $(e.currentTarget).val();
        var items = $('.card');

        // For each element
        $.each(items, function(){

            // Find name and url and push to array
            var current = $(this),
                tag = current.find('.search-tag'),
                searchTags = [
                    tag.attr('href'),
                    tag.text()
                ];

            // Look for match and/remove class
            if(searchTags.join(' ').search(new RegExp(filter, 'i')) < 0){
                current.addClass('card--filtered');
            } else {
                current.removeClass('card--filtered');
            }
        });
    },

    /**
     * Click on magnifier glass icon to show the search input
     */
    'click #search__toggle': function(e, t){
        e.preventDefault();

        var trigger = $(e.currentTarget),
            parent = trigger.closest('li'),
            input = parent.find('.search__field');

        // Show and focus the input
        input.toggleClass('search__field--expanded');
        input.focus();
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












