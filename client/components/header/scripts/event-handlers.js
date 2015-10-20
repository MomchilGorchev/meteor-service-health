/**
 * Created by momchillgorchev on 20/10/15.
 */

Template.header.events({
    'click .logout': function(e, t){
        Meteor.logout();
    },

    'click .refresh-list': function(e, t) {
        var trigger = $(e.currentTarget),
            icon = trigger.find('.material-icons');
        icon.addClass('rotating');
        console.log('Services check initiated...');
        Meteor.call('checkServicesStatus', function (err, res) {
            err ? Materialize.toast('Error: '+ err.message , 3000)
                : Materialize.toast('Services list successfully reloaded!', 3000);

            icon.removeClass('rotating');
        });
    }
});