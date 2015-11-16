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
});