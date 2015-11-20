/**
 * Created by momchillgorchev on 20/10/15.
 */


Template.statusCard.events({

    'click .card__reload': function(e, t){

        e.preventDefault();

        var trigger = $(e.currentTarget),
            parent = trigger.closest('.card'),
            cardId = parent.attr('data-itemid'),
            serviceUrl = parent.find('.service__link').attr('href'),
            icon = trigger.find('i');

        icon.addClass('rotating');
        log(cardId);

        var reqData = {
            _id: cardId,
            url: serviceUrl
        };
        // TODO implement server functionality to
        // refresh single service

        Meteor.call('checkSingleService', reqData, function(err, res){

            if(err){
                Materialize.toast('Error: '+ err.message , 3000);
            } else {
                Materialize.toast('Service was successfully refreshed' , 3000);
                icon.removeClass('rotating');
            }

        });

    }

});