/**
 * Created by momchillgorchev on 20/10/15.
 */

Template.editServiceEndpoint.events({

    'click .modal-trigger': function(e, t){
        //console.log(t);
        var trigger = $(e.currentTarget);

        var form = $('#edit-service-form');
        var cardContainer = trigger.closest('.card'),
            serviceData = {
                itemId: cardContainer.attr('data-itemid'),
                url: cardContainer.find('.service__link').attr('href'),
                name: cardContainer.find('.service__link').text(),
                statusCode: cardContainer.find('.status__code').text(),
                status: cardContainer.find('.status-display .color-code').text(),
                info: cardContainer.find('.card-reveal p').text(),
                category: cardContainer.attr('data-itemcategory')
            };

        form.attr('data-itemid', serviceData.itemId);
        form.find('#service_name').val(serviceData.name);
        form.find('#service_url').val(serviceData.url);
        form.find('#service_info').val(serviceData.info);
        form.find('#service-last-status').text(serviceData.statusCode);
        form.find('#service_category option[value="'+ serviceData.category +'"]').attr('selected', true);
        form.find('.with-gap[value="'+ serviceData.status +'"]').attr('checked', 'checked');


        form.openModal();

    },

    // Drop DB
    'click #reset-db': function(){

        Meteor.call('dropDB', function(err, res){
            err ? log(err) : Materialize.toast(res + ' categories removed!', 3000);
        });

    }
});

Template.editServicesGrid.events({

    'click #no-save': function(e, t){
        e.preventDefault();

        var trigger = $(e.currentTarget),
            parent = trigger.closest('#save__order');
        parent.removeClass('enabled');
    },

    'click #yes-save': function(e, t){

        e.preventDefault();

        // TODO - implement dr update

    }

});