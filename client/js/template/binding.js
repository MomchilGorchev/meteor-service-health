/**
 * Created by momchillgorchev on 22/05/15.
 */

Template.home.helpers({

    epAtlassian: function(){
        return Endpoints.find({category: 'Atlassian'});
    },
    epAtlassianCount: function(){
        return Endpoints.find({category: 'Atlassian'}).count();
    },

    epPowaTAG: function(){
        return Endpoints.find({category: 'PowaTAG'});
    },
    epPowaTAGCount: function(){
        return Endpoints.find({category: 'PowaTAG'}).count();
    },

    epPowaWEB: function(){
        return Endpoints.find({category: 'PowaWEB'});
    },
    epPowaWEBCount: function(){
        return Endpoints.find({category: 'PowaWEB'}).count();
    },

    epPowaAIM: function(){
        return Endpoints.find({category: 'PowaAIM'});
    },
    epPowaAIMCount: function(){
        return Endpoints.find({category: 'PowaAIM'}).count();
    },

    epHK: function(){
        return Endpoints.find({category: 'HK'});
    },
    epHKCount: function(){
        return Endpoints.find({category: 'HK'}).count();
    }
});

Template.editServicesGrid.helpers({

    epAtlassian: function(){
        return Endpoints.find({category: 'Atlassian'});
    },
    epAtlassianCount: function(){
        return Endpoints.find({category: 'Atlassian'}).count();
    },

    epPowaTAG: function(){
        return Endpoints.find({category: 'PowaTAG'});
    },
    epPowaTAGCount: function(){
        return Endpoints.find({category: 'PowaTAG'}).count();
    },

    epPowaWEB: function(){
        return Endpoints.find({category: 'PowaWEB'});
    },
    epPowaWEBCount: function(){
        return Endpoints.find({category: 'PowaWEB'}).count();
    },

    epPowaAIM: function(){
        return Endpoints.find({category: 'PowaAIM'});
    },
    epPowaAIMCount: function(){
        return Endpoints.find({category: 'PowaAIM'}).count();
    },

    epHK: function(){
        return Endpoints.find({category: 'HK'});
    },
    epHKCount: function(){
        return Endpoints.find({category: 'HK'}).count();
    }
});

Template.footer.helpers({
    powaInfo: function(){
        var powa = new Powa('Powa Frontend');
        return powa || 'Collection empty';
    }
});