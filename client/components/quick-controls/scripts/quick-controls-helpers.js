/**
 * Created by momchillgorchev on 28/11/15.
 */

Template.quickControls.helpers({

    isFirstPage(){
        return Session.get('firstPage');
    },

    isLastPage(){
        return Session.get('lastPage');
    },

    paginationPages(){

        var pages = +Session.get('paginationPages'),
            buffer = [];

        for(var i = 0; i < pages; i++){
            buffer.push(i + 1);
        }

        return buffer;
    }

});
