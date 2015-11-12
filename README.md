## Service Health Check
MeteorJS app to keep track of services/endpoints availability

#### Description
This is application is meant to be used mainly by developers that are implementing APIs/API calls or any work that is related to Service Oriented Architecture. The Meteor's server layer provides the ability to call all endpoints without worring about the Cross-Origin policy. It is also initiating the external calls into a asynchronous manner, so the UI doesn't get freezed while the backend is waiting for the services response.

#### Features
- Simple UI using the Material Design pattern - materialize.css@0.97.2
- Full CRUD possibilities on the DB entries from the UI
- Upload a JSON file or create endpoints one by one
- Auto calling of the services every minute
- Ability to quickly filter the service list
- Ability to manually set status, e.g - "In maintenance" or similar
- Mobile device optimised
- Password protected


#### To-Do
- Set alarm if service reports status different than 200
- Be able to dynamically create categories
- Lazy load/Lazy service call - Paginate the service list and call only the services that are visible on the page.
- Create UI to give the ability to enable/disable the previous feature
- Create UI to give the ability to export the service list
- Login with Google/Github/Twitter/Facebook


#### Package list
##### _In the time of writing_

- _accounts-password_        1.1.4  Password support for accounts
- _accounts-ui-unstyled_     1.1.8  Unstyled version of login widgets
- _blaze-html-templates_     1.0.1  Compile HTML templates into reactive UI with Meteor Blaze
- _check_                    1.1.0  Check whether a value matches a pattern
- _ecmascript_               0.1.6  Compiler plugin that supports ES2015+ in all .js files
- _ejson_                    1.0.7  Extended and Extensible JSON library
- _fourseven:scss_           3.4.1  Style with attitude. Sass and SCSS support for Meteor.js (with autoprefixer and sourcemaps).
- _http_                     1.1.1  Make HTTP calls to remote servers
- _iron:router_              1.0.12  Routing specifically designed for Meteor
- _jquery_                   1.11.4  Manipulate the DOM using CSS selectors
- _logging_                  1.0.8  Logging facility.
- _materialize:materialize_  0.97.0* Materialize (official): A modern responsive front-end framework based on Material Design
- _meteor-base_              1.0.1  Packages that every Meteor app needs
- _meteortoys:allthings_     2.2.0  Insanely Handy Development Tools
- _mobile-experience_        1.0.1  Packages for a great mobile user experience
- _mongo_                    1.1.3  Adaptor for using MongoDB and Minimongo over DDP
- _random_                   1.0.5  Random number generator and utilities
- _reload_                   1.1.4  Reload the page while preserving application state.
- _rubaxa:sortable_          1.3.0  Sortable: reactive minimalist reorderable drag-and-drop lists on modern browsers and touch - devices
- _sanjo:jasmine_            0.20.2  Velocity integration of the Jasmine testing framework
- _session_                  1.1.1  Session variable
- _spacebars_                1.0.7  Handlebars-like template language for Meteor
- _standard-minifiers_       1.0.2  Standard minifiers used with Meteor apps by default.
- _tinytest_                 1.0.6  Tiny testing framework
- _tomi:upload-jquery_       2.2.0  Client template for uploads using "jquery-file-upload" from blueimp
- _tomi:upload-server_       1.3.2  Upload server for Meteor. Allows to save and serve files from arbitrary directory
- _tracker_                  1.0.9  Dependency tracker to allow reactive callbacks
- _velocity:core_            0.10.8  Velocity, a Meteor specific test-runner
- _velocity:html-reporter_   0.9.1  Reactive Velocity test reports in your app.


#### Developer information
This app is still in progress and it is not deployed anywhere yet but it will be soon. If you want to have a look and start playing with it, install MeteorJS, clone the repository and run it locally
