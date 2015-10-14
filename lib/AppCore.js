/**
 * Created by momchillgorchev on 22/05/15.
 */

Endpoints = new Meteor.Collection('endpoints');


if(Meteor.isServer){

    Meteor.publish('endpoints', function(){
        return Endpoints.find();
    });

}



