/**
 * Created by momchillgorchev on 20/10/15.
 */


Template.statusCard.events({

    /**
     * Reload single card
     */
    'click .card__reload': function(e, t){
        e.preventDefault();

        // Cache elements
        var trigger = $(e.currentTarget),
            parent = trigger.closest('.card'),
            cardId = parent.attr('data-itemid'),
            serviceUrl = parent.find('.service__link').attr('href'),
            icon = trigger.find('i');

        // Rotate the icon
        icon.addClass('rotating');
        //log(cardId);

        // Build data
        var reqData = {
            _id: cardId,
            url: serviceUrl
        };

        // Call the server and handle response
        Meteor.call('checkSingleService', reqData, function(err, res){
            if(err){
                Materialize.toast('Error: '+ err.message , 3000);
            } else {
                Materialize.toast('Service was successfully refreshed' , 3000);
                icon.removeClass('rotating');
            }
        });
    },

    /**
     * Delete service
     */
    'click .delete__service-btn': function(e,t){
        e.preventDefault();

        // Cache elements
        var trigger = $(e.currentTarget),
            parent = trigger.closest('.card'),
            cardId = parent.attr('data-itemid'),
            serviceName = parent.find('.service__link').html();

        // Confirm with the user
        if(confirm('Are you sure you want to delete this service?')){
            // Call server and handle result
            Meteor.call('deleteEndpoint', cardId, function(err, res){
                if(err){
                    Materialize.toast('[Error] operation unsuccessful', 3000);
                } else {
                    Materialize.toast('[ '+ serviceName +' ] deleted!', 3000);
                    Session.set('EpsCount', Endpoints.find().count());

                    // Save new order of elements
                    //
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

                    // Call the service with the prepared data
                    Meteor.call('updateEndpointsOrder', newOrderList, function(err, res){

                        // Display the result in a toast and hide the buttons
                        if(err || res.error){
                            Materialize.toast('Error: '+ err.message , 3000);
                        } else {
                            Materialize.toast('Services order saved!' , 3000);
                        }
                    });
                }
            });
        }
    }

});