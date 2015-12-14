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

    // Cache some npm packages
    FS = Npm.require('fs');
    Future = Npm.require('fibers/future');


    var uid = Meteor.call('getUserId');
    log(uid);

    // Configure fileupload on the server
    UploadServer.init({
        tmpDir: process.env.PWD + '/uploads/tmp',
        uploadDir: process.env.PWD + '/private/', //TODO Concatenate the userId as a subfolder
        checkCreateDirectories: false //create the directories for you,

        // TODO Look for a way to get the file contents or userId here

        //getDirectory: function(fileInfo, formData) {
        //    // create a sub-directory in the uploadDir based on the content type (e.g. 'images')
        //    log(this.userId);
        //    //return formData.contentType;
        //},
        //finished: function(fileInfo, formFields) {
        //    // perform a disk operation
        //    log('fileInfo is ', fileInfo);
        //    log('formFields is ', formFields);
        //},
        //validateFile: function(file, req) {
        //    return file.type = 'application/json';
        //}

    });

});
