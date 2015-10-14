/**
 * Created by momchillgorchev on 22/05/15.
 */


Meteor.startup(function(){

    FS = Npm.require('fs');
    Future = Npm.require('fibers/future');

    UploadServer.init({
        tmpDir: process.env.PWD + '/uploads/tmp',
        uploadDir: process.env.PWD + '/private/',
        checkCreateDirectories: false //create the directories for you
    });

    (function readJSONFile(){
        var JSONData = '';
        try{
            JSONData = JSON.parse(Assets.getText("EP_DETAILS.json"));
            console.log('Loading JSON file...');

            for(var i = 0; i < JSONData.length; i++){
                var current = JSONData[i];

                var endPoint = Endpoints.find({url: current.url}, {}).fetch();
                if(!endPoint.length){
                    console.log('Adding [ '+ current.name + ' ] to the database...');
                    Endpoints.insert(current);
                }
                else {
                    console.log('Service '+ current.name + ' already added... Moving on...');
                }
            }

        } catch(e){
            console.log(e);
        }

    }());

    var validUrl = /\b((?:https?:\/\/|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/i;

    return Meteor.methods({

        sendEmail: function (to, from, subject, text) {

            check([to, from, subject, text], [String]);

            // Let other method calls from the same client start running,
            // without waiting for the email sending to complete.
            this.unblock();

            Email.send({
                to: to,
                from: from,
                subject: subject,
                text: text
            });
        },

        addEndpoint: function(service){
            if(service){
                if(service.url.match(validUrl) !== null){
                    service.status = null;
                    return Endpoints.insert(service);
                } else {
                    throw new Meteor.Error(500, 'Not a valid URL: ['+ service.url +']');
                }
            }
            return false;
        },

        deleteEndpoint: function(id){
            return Endpoints.remove({_id: id});
        },

        handleServiceStatus: function(service){
            //console.log(service);
            var endPoint = Endpoints.find({url: service.url}, {}).fetch();

            if(endPoint.length){

                Endpoints.update(
                    {
                        url: service.url
                    },
                    {
                        $set: {
                            lastStatusCode: service.lastStatusCode,
                            status: service.status
                        }
                    }
                );
            } else {
                Endpoints.insert({
                    url: service.url,
                    name: service.name,
                    lastStatusCode: service.lastStatusCode,
                    info: service.info,
                    category: service.category,
                    status: service.status
                });
            }
        },

        checkServicesStatus: function(){
            var allServices = Endpoints.find().fetch();
            //console.log('Refreshing service status...');
            var result = {}, error = false;
            //var fut = new Future();
            for(var i = 0; i < allServices.length; i++){
                try{
                    result = HTTP.call('GET', allServices[i].url);
                    console.log(result);
                }
                catch(e){
                    //console.log('');
                    var statusCode =JSON.stringify(e);
                    var sc = statusCode.match(/[0-9]\w+/).splice(0, 3).toString();
                    console.log(sc);
                    result.statusCode = sc;
                    error = true;

                    // TODO Implement send email here
                }
                var service = {
                    url: allServices[i].url,
                    name: allServices[i].name,
                    info: allServices[i].info || 'N/A',
                    category: allServices[i].category,
                    lastStatusCode: result.statusCode,
                    status: allServices.status === 'orange' ? 'orange' : 'green'
                };
                //console.log('handleServiceStatus called with:', service);
                Meteor.call('handleServiceStatus', service, function(res, err){
                    //err ? console.log(err) : console.log(res);
                });
            }
            return !error;
        },

        editService: function(data){
            var service = Endpoints.find({_id: data.id}, {}).fetch();
            if(service.length){
                //console.log('updating');
                Endpoints.update(
                    {
                        _id: data.id
                    },
                    {
                        $set: {
                            name: data.name,
                            url: data.url,
                            info: data.info,
                            status: data.status
                        }
                    }
                );
                return true;
            }
            return false;
        }
    });
});

Meteor.startup(function(){
    Meteor.call('checkServicesStatus');

    Meteor.setInterval(function(){
        Meteor.call('checkServicesStatus');
    }, 1000 * 60);

    //var powa = new Powa('Powa ');
    //console.log(powa);
});