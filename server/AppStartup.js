///**
// * Created by momchillgorchev on 22/05/15.
// */
//
//
if(Meteor.isServer) {

    Meteor.startup(function(){
        var dumpData = [
            {
                name: 'JIRA',
                url: 'https://jira.powa.com',
                category: 'Atlassian',
                info: 'This is Confluence!',
                lastStatusCode: null,
                status: 'green',
                notes: null

            },
            {
                name: 'Confluence',
                url: 'https://docs.powa.com',
                category: 'Atlassian',
                info: 'This is JIRA!',
                lastStatusCode: null,
                status: 'orange',
                notes: 'This is the message from support team'

            },
            {
                name: 'Stash',
                url: 'https://stash.ht.powa.com',
                category: 'Atlassian',
                info: 'This is Stash!',
                lastStatusCode: null,
                status: 'red',
                notes: null

            }
        ];

        if (Endpoints.find().fetch().length === 0) {
            for (var i = 0; i < dumpData.length; i++) {
                if (Endpoints.insert(dumpData[i])) {
                    console.log('Initial service added!');
                }

            }
        }


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