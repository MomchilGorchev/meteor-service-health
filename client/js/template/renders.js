/**
 * Created by momchillgorchev on 26/05/15.
 */

Template.header.rendered = function(){
    $('.button-collapse').sideNav();
    $(".dropdown-button").dropdown();
    $('.main-icon-menu').tooltip({
        delay: 0.5
    });
};

Template.home.rendered = function(){
    var tabs = $('.tabs');
    tabs.tabs();

    setInterval(function(){
        var tabsAmount = tabs.find('li').length,
            currentTab = tabs.find('a.active'),
            targetID = currentTab.attr('href'),
            tabIndex = +targetID.slice(2);
        if (tabIndex + 1 > tabsAmount){
           tabIndex = 0;
        }
        var newTarget = '#t' + parseInt(tabIndex + 1);
        tabs.find('a[href^="'+ newTarget +'"]').trigger('click');
    }, 1000 * 30);

    Meteor.call('checkServicesStatus', function(err, res){
        err ? console.log(err) : console.log(res);
    });
};

Template.addServiceEndpoint.rendered = function(){
    $('select').material_select();
};

Template.editServiceEndpoint.rendered = function(){
    $('select').material_select();
};

Template.editServicesGrid.rendered = function(){
    $('ul.tabs').tabs();
};