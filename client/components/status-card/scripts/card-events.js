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
                Bert.alert('Error: '+ err.message , 'danger');
            } else {
                Bert.alert('Service was successfully refreshed' , 'success');
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
                    Bert.alert('[Error] operation unsuccessful', 'danger');
                } else {
                    Bert.alert('[ '+ serviceName +' ] deleted!', 'success');
                    Session.set('EpsCount', Endpoints.find().count());

                    // Call the service with no data - tis will trigger
                    // Server side order replacement
                    Meteor.call('updateEndpointsOrder', function(err, res){

                        // Display the result in a toast and hide the buttons
                        if(err || res.error){
                            Bert.alert('Error: '+ err.message , 'danger');
                        } else {
                            Bert.alert('Services order saved!' , 'success');
                        }
                    });
                }
            });
        }
    }

});