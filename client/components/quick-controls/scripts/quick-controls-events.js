/**
 * Created by momchillgorchev on 28/11/15.
 */


Template.quickControls.events({

    'click #no-save': function(e, t){
        e.preventDefault();

        var trigger = $(e.currentTarget),
            parent = trigger.closest('#save__order');
        parent.removeClass('enabled');
    },

    'click #yes-save': function(e, t){

        e.preventDefault();

        // TODO - implement dr update

    }

});