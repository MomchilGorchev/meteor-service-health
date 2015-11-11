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
                    console.log('Before insert', service);
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

        /**
         * Update DB entry with data passed from the client
         * @param data
         * @returns {boolean}
         */
        updateEndpointInfo: function(data){
            // This will be an existing service every time
            // But its a good measure as this method call
            // is coming from the client
            var service = Endpoints.find({_id: data.id}, {}).fetch();
            if(service.length){
                // Select by _id and update
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
        },

        /**
         * Updates endpoint status
         * @param service - endpoint to update
         */
        updateEndpointStatus: function(service){

            if(service){
                try{
                    // Select by URL and update
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

                } catch(e){
                    throw new Meteor.Error(500, 'Internal Server Error');
                }
            }
        },

        /**
         * Run HTTP call for each entry in the DB
         * @returns {boolean}
         */
        checkServicesStatus: function(){

            this.unblock();
            // Get the DB data
            var allServices = Endpoints.find().fetch();
            var result = {},
                error = false,
                actualStatus = null;

            // Iterate over all entries
            for(var i = 0; i < allServices.length; i++){
                var current = allServices[i];
                // 'GET' the URL
                try{
                    result = HTTP.call('GET', current.url);
                    //console.log(result);
                }
                catch(e){

                    // Host is unreachable
                    console.log(e);
                    //var statusCode = JSON.stringify(e);
                    // TODO handle all error codes
                    result.statusCode = '501';
                    error = true;

                    // TODO Implement send email here
                }

                // Keep the orange status
                if(current.status === 'orange' || result.statusCode !== 200){
                    actualStatus = 'orange';
                } else if(result.statusCode === '501'){
                    actualStatus = 'red';
                } else {
                    actualStatus = 'green';
                }

                // Update with new response data
                current.lastStatusCode = result.statusCode;
                current.status = actualStatus;

                // [DEBUG]
                //console.log('updateEndpointStatus called with:', service);

                // Update the DB
                Meteor.call('updateEndpointStatus', current, function(res, err){
                    //err ? console.log(err) : console.log(res);
                });
            }
            return !error;
        }
    });

});
