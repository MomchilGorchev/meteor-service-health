///**
// * Created by momchillgorchev on 22/05/15.
// */
//
//
if(Meteor.isServer) {

    Meteor.startup(function(){

        if (Meteor.users.findOne({'emails.address': 'admin@admin.com'})) {
            //console.log('Admin account already activated...');
        } else {
            var users = [
                {
                    name: "Admin User",
                    email: "admin@admin.com",
                    roles: ['admin']
                }
            ];

            _.each(users, function (user) {
                var id;

                //console.log('Creating admin account...');

                id = Accounts.createUser({
                    email: user.email,
                    password: "password",
                    profile: {name: user.name}
                });

                //console.log('Done! Account ready to use.');
            });
        }
    });
}