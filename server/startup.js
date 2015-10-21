///**
// * Created by momchillgorchev on 22/05/15.
// */
//
//
if(Meteor.isServer) {

    Meteor.startup(function(){

        if (Meteor.users.findOne({'emails.address': 'admin@powa.com'})) {
            console.log('Admin account already activated...');
        } else {
            var users = [
                {
                    name: "Powa Admin",
                    email: "admin@powa.com",
                    roles: ['admin']
                }
            ];

            _.each(users, function (user) {
                var id;

                console.log('Creating admin account...');

                id = Accounts.createUser({
                    email: user.email,
                    password: "qwe123",
                    profile: {name: user.name}
                });

                console.log('Done! Account ready to use.');
            });
        }
    });
}