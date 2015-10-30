/**

 * Created by momchillgorchev on 20/10/15.
 */

Template.addServiceEndpoint.events({
    'submit #createNewService': function(e, t){
        e.preventDefault();

        var container = $(e.currentTarget);

        var newService = {
            name: container.find('#service_name').val(),
            url: container.find('#service_url').val(),
            info: container.find('#service_info').val(),
            category: container.find('#service_category').val(),
            lastStatusCode: null,
            status: null
        };

        if(newService.name.length < 1 || newService.url.length < 1 || newService.category.length < 1){
            Materialize.toast('You need to fill all the fields!', 3000);
        } else {
            Meteor.call('addEndpoint', newService, function(err, res){

                console.log(res);

                err ? Materialize.toast('Error: '+ err.message , 3000)
                    : Materialize.toast('Service '+ newService.name + ' successfully added!', 3000);
            });
        }
    }
});
