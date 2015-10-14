Template.home.events({
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
    }
});