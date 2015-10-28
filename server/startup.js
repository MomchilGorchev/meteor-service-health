/**
 * Created by momchillgorchev on 28/10/15.
 *
 * Server startup script
 */

Meteor.startup(function(){

    // ---> TEMP
    // Always add admin user
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
    // <--- TEMP

    // Call all services
    Meteor.call('checkServicesStatus');

    // Assign a call every minute
    Meteor.setInterval(function(){
        Meteor.call('checkServicesStatus');
    }, 1000 * 60);

    // Cache some npm packages
    FS = Npm.require('fs');
    Future = Npm.require('fibers/future');

    // Configure fileupload on the server
    UploadServer.init({
        tmpDir: process.env.PWD + '/uploads/tmp',
        uploadDir: process.env.PWD + '/private/',
        checkCreateDirectories: false //create the directories for you
    });

});
