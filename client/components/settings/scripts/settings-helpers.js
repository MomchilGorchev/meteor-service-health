/**
 * Created by momchillgorchev on 07/02/16.
 */

Template.settings.helpers({

    userInfo(){

        return Meteor.users.findOne().emails[0].address;

    }

});