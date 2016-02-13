/**
 * Created by momchillgorchev on 07/02/16.
 */

Template.settings.events({

    // Drop DB
    'click #reset-db'(){

        Meteor.call('dropDB', function(err, res){
            err ? log(err) : Bert.alert(res + ' categories removed!', 'success');
            Session.set('EpsCount', Endpoints.find().count());
        });

    }

});