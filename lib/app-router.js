Router.configure({
    layoutTemplate: 'mainLayout',
    loadingTemplate: 'loading',
    notFoundTemplate: 'notFound'
});

BasicController = RouteController.extend({
    onBeforeAction: function(){
        Meteor.subscribe('endpoints');
        this.next();
    },
    waitOn: function(){
        return [
            Meteor.subscribe('endpoints')
        ];
    },
    fastRender: true

});

UserAccessController = RouteController.extend({
    onBeforeAction: function(){
        Meteor.subscribe('endpoints');
        Meteor.subscribe('categories');
        if (!(Meteor.loggingIn() || Meteor.user())) {
            this.render("login");
        } else {
            Meteor.subscribe('endpoints');
            Meteor.subscribe('categories');
            this.next();
        }
    },
    waitOn: function(){
        return [
            Meteor.subscribe('endpoints'),
            Meteor.subscribe('categories')
        ];
    },
    fastRender: true
});

if (Meteor.isServer) {
    // Cache the NPM modules needed
    fs = Npm.require("fs");
    os = Npm.require("os");
    path = Npm.require("path");
    var Busboy = Meteor.npmRequire("busboy");
    // TODO - process.env.PWD is different on every machine and depends on where the meteor process lives.
    // TODO It needs to be adjusted once its deployed.
    baseUrl = process.env.PWD;
    // Configure server side onBeforeEach only
    Router.onBeforeAction(function (req, res, next) {
        // Store filenames and then pass them to request.
        var filenames = [];
        // Catch POST requests
        if (req.method === "POST") {
            // We need to use Busboy middleware as the IronRouter connection middleware
            // is still not available. Using Busboy we can intercept the file, write it to
            // temp directory and pass it to the request object, which will be available
            // in IronRouter's "action" handler
            var busboy = new Busboy({ headers: req.headers });
            busboy.on("file", function (fieldname, file, filename) {

                console.log(file._read());
                // This resolves to /tmp/filename
                var saveTo = path.join(os.tmpDir(), filename);
                // Write the file to a temp dir
                file.pipe(fs.createWriteStream(saveTo));
                filenames.push(saveTo);
            });
            // Handle normal fields data as well
            busboy.on("field", function(fieldname, value) {
                req.body[fieldname] = value;
            });
            // Pass filenames to request
            busboy.on("finish", function () {
                req.filenames = filenames;
                next();
            });
            // Pass request to busboy
            req.pipe(busboy);
        } else {
            // Continue to next middleware
            next();
        }
    });
}


Router.map(function(){

    this.route('login', {
        path: '/login',
        waitOn: function() {
            if(Meteor.user()) {
                this.redirect("home");
            }
        }
    });

    this.route('home', {
        path: '/',
        controller: BasicController
    });

    this.route('addServiceEndpoint', {
        path: '/addServiceEndpoint',
        controller: UserAccessController // Change this when authentication is implemented
    });

    this.route('editServiceEndpoint', {
        path: '/editServiceEndpoint',
        controller: UserAccessController // Change this when authentication is implemented
    });

    /**
     * Server routes
     */

    /**
     * Returns name and last reported status code
     * for all services in the DB, as JSON string
     */
    Router.route('/status', function(){

        // Caache the route
        var _this = this;
        // Set response headers
        _this.response.statusCode = 200;
        _this.response.setHeader("Content-Type", "application/json");
        _this.response.setHeader("Access-Control-Allow-Origin", "*");
        _this.response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

        // Find and fetch the name and status for each service
        var endpointsData = Endpoints.find({}, {
            fields: {
                _id: 0,
                name: 1,
                lastStatusCode: 1
            }
        }).fetch();

        //log(endpointsData);
        // Send the data as JSON string
        _this.response.end(JSON.stringify(endpointsData));

    }, {where: 'server'});

    /**
     * File upload endpoint
     * Read te file and writes it to user-specific local JSON filee
     */
    Router.route('upload', {
        where: 'server',
        path: '/upload/:userId',
        action: function(req, res, next){

            // Get the param from the request
            var userId =  this.params.userId;

            // Get the filename only
            var filenameOnly = req.filenames[0].split('/');
            filenameOnly = filenameOnly[filenameOnly.length - 1];

            // Alternatively we can skip the saving on the server local dir and just save in the cloud for scalability
            fs.createReadStream(req.filenames[0]).pipe(fs.createWriteStream(baseUrl + '/.uploads/userfiles/'+ userId +'-'+ filenameOnly));

            // 2. Save the filename to collection and to the UserProfile object
            // TODO figure out if possible to call method
            res.write(baseUrl + '/.uploads/userfiles/'+ userId +'-'+ filenameOnly);

            res.end();

        }
    });
});