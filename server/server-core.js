/**
 * Server core config
 * @type {string[]}
 *
 * Application core functionality module
 * To be extended
 * @constructor
 */
function Core(){

    let self = this;
    self.JSON_FILENAME = 'EP_DETAILS.json';
    self.VALID_URL = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;

    /**
     * Publish functions block
     */
    self.publishData = function(){
        Meteor.publish('endpoints', function(){
            return Endpoints.find({owner: this.userId});
        });

        Meteor.publish('categories', function(){
            return Categories.find({owner: this.userId});
        });
    };

    /**
     * Init the instance
     */
    self.init = function(){
        self.publishData();
    };

    self.init();

}
// Instantiate
core = new Core;


