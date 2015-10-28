/**
 * Created by momchillgorchev on 28/10/15.
 */


Meteor.startup(function(){

    return Meteor.methods({

        /**
         * Not used
         * @param to
         * @param from
         * @param subject
         * @param text
         */
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

        /**
         * Add endpoint to the DB
         * @param service - object containing the new service data
         * @returns {*} - _id of the newly created entry
         */
        addEndpoint: function(service){
            if(service){
                // Validate the service URL
                if(service.url.match(core.VALID_URL) !== null){
                    // Reset status
                    service.status = null;
                    // Find the next available id
                    var existingEntries = Endpoints.find().count();
                    service.order = existingEntries + 1;
                    // And insert to DB
                    return Endpoints.insert(service);
                } else {
                    // Throw an error for not valid URL
                    throw new Meteor.Error(500, 'Not a valid URL: ['+ service.url +']');
                }
            }
            // Empty input
            return false;
        },

        /**
         * Removes DB entry by _id
         * @param id
         * @returns {*|any}
         */
        deleteEndpoint: function(id){

            // If valid input return the result of the DB operation
            // Else false
            return id ? Endpoints.remove({_id: id}) : false;
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
