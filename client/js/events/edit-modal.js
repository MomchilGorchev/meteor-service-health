Template.editModal.events({

    'click .with-gap':function(e, t){
        var target = $(e.currentTarget);
        var all = $('.with-gap');
        all.removeClass('active');
        target.addClass('active');
    },

    'click #closeModal': function(e, t){
        e.preventDefault();
        var modal = $(e.currentTarget).closest('#edit-service-form');
        modal.closeModal();
    },

    'submit #editService': function(e, t){
        e.preventDefault();
        console.log(e);
        var form = $(e.currentTarget);

        if(form.find('.with-gap.active').val() === 'orange' || form.find('.with-gap.active').val() === 'red'){

        }
        var data = {
                id: form.closest('#edit-service-form').attr('data-itemid'),
                name: form.find('#service_name').val(),
                url: form.find('#service_url').val(),
                info: form.find('#service_info').val(),
                status: form.find('.with-gap.active').val()

            };

        //issue: !!(data.status === 'red' || data.status === 'orange')
        console.log(data);
        Meteor.call('editService', data, function(err, res){
            err ? Materialize.toast('Error: '+ err.message , 3000)
                : Materialize.toast('Service '+ data.name + ' successfully saved!', 3000);
        });
    },

    'click .delete__service-btn': function(e,t){
        var trigger = $(e.currentTarget),
            modal = trigger.closest('.modal'),
            serviceID = modal.attr('data-itemid'),
            serviceName = modal.find('#service_name').val();

        if(confirm('Are you sure you want to delete this service?')){
            Meteor.call('deleteEndpoint', serviceID, function(err, res){
                if(err){
                    Materialize.toast('[Error] operation unsuccessful', 3000);
                } else {
                    Materialize.toast('Service ['+ serviceName +'] deleted!', 3000);
                }
            });
        }
    }
});