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

    /**
     * Read JSON data into collection
     * require const filename: EP_DETAILS.json
     */
    (function readJSONFile(){
        var JSONData = '';
        try{
            JSONData = JSON.parse(Assets.getText(core.JSON_FILENAME));
            console.log('Loading JSON file...');

            for(var i = 0; i < JSONData.length; i++){
                var current = JSONData[i];

                var endPoint = Endpoints.find({url: current.url}, {}).fetch();
                if(!endPoint.length){
                    //console.log('Adding [ '+ current.name + ' ] to the database...');
                    Endpoints.insert(current);
                }
                else {
                    //console.log('Service '+ current.name + ' already added... Moving on...');
                }
            }

        } catch(e){
            console.log(e);
        }
    }());

    //var validUrl =

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
                if(service.url.match(core.VALID_URL) !== null){
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
            this.unblock();
            var allServices = Endpoints.find().fetch();
            //console.log('Refreshing service status...');
            var result = {},
                error = false,
                actualStatus = null;
            //var fut = new Future();
            for(var i = 0; i < allServices.length; i++){
                var current = allServices[i];
                try{
                    result = HTTP.call('GET', current.url);
                    //console.log(result);
                }
                catch(e){
                    console.log(e);
                    var statusCode =JSON.stringify(e);
                    var sc = '501';
                    console.log(sc);
                    result.statusCode = sc;
                    error = true;

                    // TODO Implement send email here
                }

                if(current.status === 'orange' || result.statusCode !== 200){
                    actualStatus = 'orange';
                } else if(result.statusCode === '501'){
                        actualStatus = 'red';
                } else {
                    actualStatus = 'green';
                }

                var service = {
                    url: current.url,
                    name: current.name,
                    info: current.info || 'N/A',
                    category: current.category,
                    lastStatusCode: result.statusCode,
                    status: actualStatus
                };
                console.log('handleServiceStatus called with:', service);
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