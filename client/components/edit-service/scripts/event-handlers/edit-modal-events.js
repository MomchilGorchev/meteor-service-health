/**
 * Created by momchillgorchev on 20/10/15.
 */

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
        var form = $(e.currentTarget),
            modal = form.closest('#edit-service-form');

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
        Meteor.call('updateEndpointInfo', data, function(err, res){
            err ? Bert.alert('Error: '+ err.message , 'danger')
                : Bert.alert('Service '+ data.name + ' successfully saved!', 'success');
        });

        modal.closeModal();
    }
});