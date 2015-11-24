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

        // TODO - Implement check if that service already exist and dont add it if yes
        // TODO - also implement immediate service check once its added
        // TODO - also investigate why is all that empty space in the service name
        addEndpoint: function(service){
            if(service){
                // Validate the service URL
                if(service.url.match(core.VALID_URL) !== null){

                    // Check for existing entry with that URL
                    var existingRecord = Endpoints.find({url: service.url}, {}).fetch();
                    if(!existingRecord.length){

                        // Reset status
                        service.status = null;
                        // Find the next available id
                        var existingEntries = Endpoints.find().count();
                        service.order = existingEntries + 1;
                        // And insert to DB
                        // log('Before insert', service);
                        return Endpoints.insert(service);
                    } else {
                        throw new Meteor.Error(409, 'Service URL already exist');
                    }

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
                    return Endpoints.update(
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
         * Ping single service to check the status
         * Built to be reusable from the client and internal server processes
         * @param service - Object containing the service details
         * @returns {any} - Returns the result of updateEndpointStatus method
         */
        checkSingleService: function(service){

            // Validate the input
            // This is necessary as this method is used by the client as well
            check(service, Object);

            // Request the db entry and compare urls
            // This is necessary as this method is used by the client as well
            var dbEntry = Endpoints.findOne({_id: service._id}),
                result, actualStatus;

            // If everything match
            if(service.url === dbEntry.url){

                // Init check call
                try{
                    // Plain GET request, needs to be updated when
                    // specifying a method is implemented
                    result = HTTP.get(service.url, {});

                    // Keep the orange status
                    // Or look for 'updated manually' flag (not implemented)
                    if(dbEntry.status === 'orange' || result.statusCode !== 200){
                        actualStatus = 'orange';
                    } else if(result.statusCode === '503'){
                        actualStatus = 'red';
                    } else {
                        actualStatus = 'green';
                    }

                    // [DEBUG]
                    log('Status color code after ping: '+ dbEntry.status);

                    // Update with new response data
                    dbEntry.lastStatusCode = result.statusCode;
                    dbEntry.status = actualStatus;

                // Catch any exceptions
                } catch(e){

                    // [DEBUG]
                    log(e);
                    //// TODO handle all error codes
                    //result.statusCode = '501';
                    //error = true;

                    dbEntry.status = 'red';
                    dbEntry.lastStatusCode = '503';

                    // TODO Implement send email here
                    // If alert is set for this service

                }

                // [DEBUG]
                //console.log('updateEndpointStatus called with:', service);

                // Update the DB
                return Meteor.call('updateEndpointStatus', dbEntry);

            }

        },


        /**
         * Run HTTP call for each entry in the DB
         * @returns {boolean}
         */
        checkServicesStatus: function(){

            // Allow other messages to use the DDP
            this.unblock();
            // Get the DB data
            var allServices = Endpoints.find().fetch(),
                error = false;

            // Iterate over all entries
            // This needs to be updated when pagination is implemented
            // Right now it doesn't scale
            for(var i = 0, count = allServices.length; i < count; i++){
                var current = allServices[i];

                // [DEBUG]
                //log('Calling '+ current.url);

                // Call method to check single service
                Meteor.call('checkSingleService', current, function(err, res){
                    //log(err ? err : res);
                });
            }
            return !error;
        }
    });

});
