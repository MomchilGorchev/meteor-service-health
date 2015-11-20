/**
 * Created by momchillgorchev on 20/10/15.
 */


Template.statusCard.events({

    'click .card__reload': function(e, t){

        e.preventDefault();

        var trigger = $(e.currentTarget),
            parent = trigger.closest('.card'),
            cardId = parent.attr('data-itemid');

        trigger.find('i').addClass('rotating');
        log(cardId);

        // TODO implement server functionality to
        // refresh single service

    }

});