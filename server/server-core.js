/**
 * Server core config
 * @type {string[]}
 *
 * Application core functionality module
 * To be extended
 * @constructor
 */
function Core(){

    var self = this;
    self.JSON_FILENAME = 'EP_DETAILS.json';
    self.VALID_URL = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;

}
// Instantiate
core = new Core;


if(Meteor.isServer){

    Meteor.publish('endpoints', function(){
        return Endpoints.find({owner: this.userId});
    });

    Meteor.publish('categories', function(){
        return Categories.find({owner: this.userId});
    });

}

// TODO Specify method when creating endpoint
// FIX the issue with file upload on Heroku
// Remove the autologin
// Update README
// Change layout of 'Save new order' functionality
