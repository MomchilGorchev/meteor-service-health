/**
 * Created by momchillgorchev on 20/10/15.
 */

Template.header.events({
    'click .logout': function(e, t){
        Meteor.logout();
    },

    'click .refresh-list': function(e, t) {
        var trigger = $(e.currentTarget),
            icon = trigger.find('.material-icons');
        icon.addClass('rotating');
        console.log('Services check initiated...');
        Meteor.call('checkServicesStatus', function (err, res) {
            err ? Materialize.toast('Error: '+ err.message , 3000)
                : Materialize.toast('Services list successfully reloaded!', 3000);

            icon.removeClass('rotating');
        });
    },

    'keyup #search': function(e, t){
        var filter = $(e.currentTarget).val();
        var items = $('.card');
        $.each(items, function(){
            var current = $(this);
            if(current.text().search(new RegExp(filter, 'i')) < 0){
                current.hide();
            } else {
                current.show();
            }
        });
    },

    'click #search__toggle': function(e, t){
        e.preventDefault();

        var trigger = $(e.currentTarget),
            parent = trigger.closest('li'),
            input = parent.find('.search__field');

        log(input);

        input.toggleClass('search__field--expanded');


    }
});
