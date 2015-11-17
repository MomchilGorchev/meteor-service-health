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
});