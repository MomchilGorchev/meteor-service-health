/**
 * Created by momchillgorchev on 28/11/15.
 */

Template.quickControls.helpers({

    isFirstPage: function(){
        return Session.get('firstPage');
    },

    isLastPage: function(){
        return Session.get('lastPage');
    }

});
