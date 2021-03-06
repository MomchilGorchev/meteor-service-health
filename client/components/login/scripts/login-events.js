/**
 * Created by momchillgorchev on 20/10/15.
 */

Template.login.events({
    'click #click-to-login, keyup': function(e, t){

        if(e.keyCode === 13 || e.type === 'click'){
            var email = t.firstNode.querySelector('#login-email').value;
            var pass = t.firstNode.querySelector('#login-password').value;
            Meteor.loginWithPassword(email, pass, function(err){
                if(err){
                    Bert.alert('Error: '+ err.message , 'danger');
                }
            });
        }
    }
});