/**
 * Created by momchillgorchev on 28/10/15.
 */


Meteor.startup(() => {

    return Meteor.methods({

        /**
         * Not used
         * @param to
         * @param from
         * @param subject
         * @param text
         */
        sendEmail (to, from, subject, text) {

            check([to, from, subject, text], [String]);

            // Let other method calls from the same client start running,
            // without waiting for the email sending to complete.
            this.unblock();

            Email.send({
                to,
                from,
                subject,
                text
            });
        },

        /**
         * Get DB records count for the current user
         * @returns {*}
         */
        getEpsCount(){
            return Endpoints.find({owner: Meteor.userId()}).count();
        },

        /**
         * Add endpoint to the DB
         * @param requestData - object containing the new service data and the user that own it
         * @returns {*} - _id of the newly created entry
         */
        addEndpoint(requestData){

            this.unblock();
            if(requestData){
                var service = requestData.data;
                // Validate the service URL
                if(service.url.match(core.VALID_URL)){

                    // Check for existing entry with that URL
                    var existingRecord = Endpoints.findOne({url: service.url, owner: requestData.owner});
                    if(existingRecord === undefined){

                        // Reset status
                        service.status = null;
                        // Find the next available order
                        var existingEntries = Endpoints.find({owner: requestData.owner}).count();
                        service.order = service.order === undefined ? existingEntries + 1 : service.order;
                        service.owner = requestData.owner;
                        // And insert to DB
                        // log('Before insert', service);
                        var newEntry = Endpoints.insert(service);
                        if(newEntry){
                            service._id = newEntry;
                            Meteor.call('checkSingleService', service, (err, res) => {
                                return !err;
                            });

                            return true;
                        }

                    } else {
                        throw new Meteor.Error(409, 'Service URL already exist');
                    }

                } else {
                    // Throw an error for not valid URL
                    throw new Meteor.Error(500, `Not a valid URL: [ ${service.url} ]`);
                }
            }
            // Empty input
            throw new Meteor.Error(500, 'Not a valid input');
        },

        /**
         * Removes DB entry by _id
         * @param id
         * @returns {*|any}
         */
        deleteEndpoint(id){

            // If valid input return the result of the DB operation
            // Else false
            return id ? Endpoints.remove({_id: id}) : false;
        },

        /**
         * Update DB entry with data passed from the client
         * @param data
         * @returns {boolean}
         */
        updateEndpointInfo(data){
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
        updateEndpointStatus(service){

            if(service){
                try{
                    // Select by URL and update
                    return Endpoints.update({url: service.url, owner: Meteor.userId()},
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
         * Set new order to endpoints after endpoint is being deleted
         * on the client. This method ensures correct pagination indexes.
         */
        updateEndpointsOrder(){

            // Cache current user
            var currentUser = Meteor.userId();
            // If there is no parameter array of service objects
            // Reset all entries order value
            var eps = Endpoints.find({owner: currentUser}).fetch();

            // Iterate
            for(var j = 0, iterations = eps.length; j < iterations; j++){

                //console.log('Setting order '+ (j + 1) +' to item number '+ j);

                // Grab mongo id
                var currentItemId = eps[j]._id;

                // Set new order relative to the current iteration
                Endpoints.update(
                    {
                        _id: currentItemId
                    },
                    {
                        // Set new order
                        $set: {
                            order: j + 1
                        }
                    }
                );
            }

            return true;
        },

        /**
         * Ping single service to check the status
         * Built to be reusable from the client and internal server processes
         * @param service - Object containing the service details
         * @returns {any} - Returns the result of updateEndpointStatus method
         */
        checkSingleService(service){

            // Validate the input
            // This is necessary as this method is used by the client as well
            check(service, Object);

            // Request the db entry and compare urls
            // This is necessary as this method is used by the client as well
            let dbEntry = Endpoints.findOne({_id: service._id, owner: Meteor.userId()}),
                result, actualStatus;

            // If everything match
            if(service.url === dbEntry.url){

                // [DEBUG]
                //console.log('service is: ', service);

                // Init check call
                try{
                    // Plain request
                    result = HTTP[service.method](service.url, {});

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
                    //log('Status color code after ping: '+ dbEntry.status);

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
        checkServicesStatus(){

            // Allow other messages to use the DDP
            this.unblock();
            // Get the DB data
            let allServices = Endpoints.find({owner: Meteor.userId()}).fetch(),
                error = false;

            // Iterate over all entries
            // This needs to be updated when pagination is implemented
            // Right now it doesn't scale
            for(var i = 0, count = allServices.length; i < count; i++){
                var current = allServices[i];

                // [DEBUG]
                //log('Calling '+ current.url);

                // Call method to check single service
                Meteor.call('checkSingleService', current, (err, res) => {
                    //log(err ? err : res);
                });
            }
            return !error;
        },

        /**
         * Remove all records from the DB
         * for the current user only
         * @returns {*}
         */
        dropDB(){
            return Endpoints.remove({owner: Meteor.userId()});
        }
    });

});
