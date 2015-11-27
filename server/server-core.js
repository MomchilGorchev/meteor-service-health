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
//
//// TODO implement with methods
//Endpoints.allow({
//    insert: function(){
//        return true;
//    },
//    update: function(){
//        return true;
//    },
//    remove: function(){
//        return true;
//    }
//});


if(Meteor.isServer){

    Meteor.publish('endpoints', function(){
        return Endpoints.find();
    });

    Meteor.publish('categories', function(){
        return Categories.find({owner: this.userId});
    });

}