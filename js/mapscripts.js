

var additional_attrib = 'Created by Iana Dikidjieva for <a href="http://www.restoringtrenton.org">Restoring Trenton</a><br>';
  
  
var map;
    

function init(){

  var boundary = L.latLngBounds(config.southwest, config.northeast);

  // initiate leaflet map
  map = new L.Map('cartodb-map', {
    center: [40.224, -74.76], 
    zoom: 15,
    minZoom: 13,
    maxBounds: boundary
  });

  new L.Control.GeoSearch({
      provider: new L.GeoSearch.Provider.Google()
  }).addTo(map);

  var cartoUrl = 'http://restoring-trenton.cartodb.com/api/v2/viz/a6f57b9c-c374-11e4-a69d-0e018d66dc29/viz.json';


  cartodb.createLayer(map, cartoUrl)
     .addTo(map)
     .on('done', function(layer) {    })
     .on('error', function() { 
      //log the error
    });


var stamen = L.tileLayer('http://a.tile.stamen.com/toner/{z}/{x}/{y}.png', {attribution: additional_attrib + '<a href="http://stamen.com">Stamen</a>'}).addTo(map); 

var bases = { "STAMEN TONER BASEMAP": stamen };

var sublayers = [];

//styling the different types of parcels -- add any others here

    var vacantLotsGet = {
      sql: "SELECT * FROM master_properties where parc_type = 'VACANT LOT'",
      cartocss: "#trenton_properties{polygon-fill: #B9D132; polygon-opacity:0.5;line-color:#fff; line-opacity:0.2;}",
    }

    var vacantBldgsGet = {
      sql: "SELECT * FROM master_properties where parc_type = 'VACANT BLDG'",
      cartocss: "#trenton_properties{polygon-fill: #D11717; polygon-opacity:0.6;line-color: #fff; line-opacity:0.2;}"
    }

    var lienPropsGet = {
      sql: "SELECT * FROM master_properties where (city_liens > 0 or priv_liens > 0)",
      cartocss: "#trenton_properties{polygon-fill: #000; polygon-opacity:0.2;line-color:#000 ; line-width: 2; line-opacity:0.5;}"
    }

    var homesteadGet = {
      sql: "SELECT * FROM master_properties where owner = 'CITY OF TRENTON' and class = '2' and parc_type = 'VACANT BLDG'",
      cartocss: "#trenton_properties{polygon-fill: #00FBFF; polygon-opacity:0.2;line-color:#00FBFF ; line-width: 3; line-opacity:0.8;}"
    }

    var invisibleLayer = {
      sql: "SELECT * FROM master_properties",
      cartocss: "#trenton_properties{polygon-opacity:0;line-color:#fff ; line-width: 1; line-opacity:0;}"

    }


//holding the different layers we're creating from the cartodb base ('trenton_parcels', loaded from our cartoUrl)

overlayLayers = {};

cartodb.createLayer(map, cartoUrl)
  .addTo(map)
  .on('done', function(layer) { 
    layer.setZIndex(2);
    var sublayer = layer.getSubLayer(0);
    sublayer.set(vacantBldgsGet);
    sublayers.push(sublayer);
    overlayLayers["VACANT BUILDINGS"] = layer;

   }).on('error', function() { 
    //log the error
  });

cartodb.createLayer(map, cartoUrl)
  .addTo(map)
  .on('done', function(layer) { 
    layer.setZIndex(3);
    var sublayer = layer.getSubLayer(0);
    sublayer.set(vacantLotsGet);
    sublayers.push(sublayer);
    overlayLayers["VACANT LOTS"] = layer;

   }).on('error', function() { 
    //log the error
  });

cartodb.createLayer(map, cartoUrl)
//  .addTo(map)
  .on('done', function(layer) { 
    layer.setZIndex(4);
    var sublayer = layer.getSubLayer(0);
    sublayer.set(homesteadGet);
    sublayers.push(sublayer);
    overlayLayers["POSSIBLE HOMESTEADS"] = layer;

   }).on('error', function() { 
    //log the error
  });

cartodb.createLayer(map, cartoUrl)
  .on('done', function(layer) { 
    layer.setZIndex(5);
    var sublayer = layer.getSubLayer(0);
    sublayer.set(lienPropsGet);
    sublayers.push(sublayer);
    overlayLayers["OUTSTANDING LIENS"] = layer;
    L.control.layers(null, overlayLayers).addTo(map)

   }).on('error', function() { 
    //log the error
  });

//this is the info layer


cartodb.createLayer(map, cartoUrl)
  .addTo(map)
  .on('done', function(layer) { 
    layer.setZIndex(100);
    var sublayer = layer.getSubLayer(0);
    sublayer.set(invisibleLayer);
    sublayers.push(sublayer);

   }).on('error', function() { 
    //log the error
  });


  var popup = L.popup();

  function onMapClick(e) {
    popup
      .setLatLng(e.latlng)
      .setContent("You clicked the map at " + e.latlng.toString() + "\n\nSend feedback?")
      .openOn(map);
  }

  map.on('click', onMapClick);

}
