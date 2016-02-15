/**
 * Created by momchillgorchev on 15/02/16.
 */

Template.register.events({

    'click #click-to-register, keyup'(e, t){

        if(e.keyCode === 13 || e.type === 'click'){
            var container = t.firstNode;

            var email = container.querySelector('#register-email').value;
            var pass = container.querySelector('#register-password').value;
            var passConf = container.querySelector('#confirm-register-password').value;

            check(email, String);
            check(pass, String);
            check(passConf, String);

            if(pass === passConf){

                Accounts.createUser({
                    email: email,
                    password: pass
                });
            }
        }
    }

});
