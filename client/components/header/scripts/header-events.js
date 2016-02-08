/**
 * Created by momchillgorchev on 20/10/15.
 */

Template.header.events({
    'click .logout': function(e, t){
        Meteor.logout();
    }
});
