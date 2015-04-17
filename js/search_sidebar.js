function sidebar_init (sidebar) {
  sidebar.setContent("<h1>Advanced Search</h1>\
    <form id='advanced_search' onSubmit='return advanced_geosearch();'>\
    <fieldset>\
    <legend>Query:</legend>\
    Address:<br>\
    <input type='text' id='address'>\
    <br>\
    Lot Type:<br>\
    <input type='text' id='lot_type'>\
    <br><br>\
    <input type='submit' value='Go'>\
    </fieldset>\
    </form>\
    ");
}

function advanced_geosearch () {
  var address = $('#address')[0].value;

  try {
    searchModule.geosearch(address);
  }

  catch (error) {
  }

  // returns false in order to prevent page redirect on form submit    
  return false;
}

L.Control.EasyButton = L.Control.extend({
    options: {
        position: 'topleft',
        title: '',
        intendedIcon: 'fa-circle-o'
    },

    onAdd: function () {
        var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');

        this.link = L.DomUtil.create('a', 'leaflet-bar-part', container);
        this._addImage()
        this.link.href = '#';

        L.DomEvent.on(this.link, 'click', this._click, this);
        this.link.title = this.options.title;

        return container;
    },

    intendedFunction: function(){ alert('no function selected');},

    _click: function (e) {
        L.DomEvent.stopPropagation(e);
        L.DomEvent.preventDefault(e);
        this.intendedFunction();
    },

    _addImage: function () {
        var extraClasses = this.options.intendedIcon.lastIndexOf('fa', 0) === 0 ? ' fa fa-lg' : ' glyphicon';

        var icon = L.DomUtil.create('i', this.options.intendedIcon + extraClasses, this.link);
        icon.id = this.options.id;
    }
});

L.easyButton = function( btnIcon , btnFunction , btnTitle , btnMap , btnId) {
  var newControl = new L.Control.EasyButton;

  if (btnIcon) newControl.options.intendedIcon = btnIcon;
  if (btnId) newControl.options.id = btnId;

  if ( typeof btnFunction === 'function'){
    newControl.intendedFunction = btnFunction;
  }

  if (btnTitle) newControl.options.title = btnTitle;

  if ( btnMap == '' ){
    // skip auto addition
  } else if ( btnMap ) {
    btnMap.addControl(newControl);
  } else {
    map.addControl(newControl);
  }
  return newControl;
};