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
    self.VALID_URL = /\b((?:https?:\/\/|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/i;

}
// Instantiate
core = new Core;


if(Meteor.isServer){

    Meteor.publish('endpoints', function(){
        return Endpoints.find();
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
