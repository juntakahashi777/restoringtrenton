var map;
var sql = new cartodb.SQL({ user: 'restoring-trenton', format: 'geojson' });
var polygon;

var popup = L.popup();

function init(){
  var boundary = L.latLngBounds(config.southwest, config.northeast);

  // initiate leaflet map
  map = new L.Map('cartodb-map', {
    center: [40.224, -74.76], 
    zoom: 15,
    minZoom: 13,
    maxBounds: boundary
  });

  var cartoUrl = 'http://restoring-trenton.cartodb.com/api/v2/viz/a6f57b9c-c374-11e4-a69d-0e018d66dc29/viz.json';

  // layer - shows all property boundaries
  cartodb.createLayer(map, cartoUrl).addTo(map);


  var stamen = L.tileLayer('http://a.tile.stamen.com/toner/{z}/{x}/{y}.png', {attribution: config.additional_attrib + '<a href="http://stamen.com">Stamen</a>'});
  stamen.addTo(map);

  var bases = { "STAMEN TONER BASEMAP": stamen };


  // var mapbox = L.tileLayer('http://api.tiles.mapbox.com/v4/mapbox.satellite.json?access_token=pk.eyJ1IjoianVudGFrYWhhc2hpNzc3IiwiYSI6InB5NVlRUUEifQ.qPh-0ql3im5gInKu3dgJiw',
  //     {
  //       attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>'
  //     });
  // map.addLayer(mapbox);



  //styling the different types of parcels -- add any others here

  var vacantLotsGet = {
    sql: "SELECT * FROM " + config.database_name + " where parc_type = 'VACANT LOT'",
    cartocss: "#trenton_properties{polygon-fill: #B9D132; polygon-opacity:0.5;line-color:#fff; line-opacity:0.2;}",
  }

  var vacantBldgsGet = {
    sql: "SELECT * FROM " + config.database_name + " where parc_type = 'VACANT BLDG'",
    cartocss: "#trenton_properties{polygon-fill: #D11717; polygon-opacity:0.6;line-color: #fff; line-opacity:0.2;}"
  }

  var lienPropsGet = {
    sql: "SELECT * FROM " + config.database_name + " where (city_liens > 0 or priv_liens > 0)",
    cartocss: "#trenton_properties{polygon-fill: #000; polygon-opacity:0.2;line-color:#000 ; line-width: 2; line-opacity:0.5;}"
  }

  var homesteadGet = {
    sql: "SELECT * FROM " + config.database_name + " where owner = 'CITY OF TRENTON' and class = '2' and parc_type = 'VACANT BLDG' and redev_area is not NULL",
    cartocss: "#trenton_properties{polygon-fill: #00FBFF; polygon-opacity:0.2;line-color:#00FBFF ; line-width: 3; line-opacity:0.8;}"
  }

  var invisibleLayer = {
    sql: "SELECT * FROM " + config.database_name + " ",
    cartocss: "#trenton_properties{polygon-opacity:0;line-color:#fff ; line-width: 1; line-opacity:0;}"

  }

  var sublayers = [vacantLotsGet, vacantBldgsGet, lienPropsGet, homesteadGet, invisibleLayer];


  // -------------------------
  // Add geosearch module

  new L.Control.GeoSearch({
      provider: new L.GeoSearch.Provider.Google()
  }).addTo(map);
  // -------------------------

  // -------------------------
  // Add leaflet-search module

  var markersLayer = new L.LayerGroup();
  // map.addLayer(markersLayer);

  var controlSearch = new L.Control.Search({layer: markersLayer, initial: false});
  map.addControl(controlSearch);

  // -------------------------


  //holding the different layers we're creating from the cartodb base ('trenton_parcels', loaded from our cartoUrl)

  overlayLayers = {};

  createMapLayer(map, cartoUrl, 2, vacantBldgsGet);


  // cartodb.createLayer(map, cartoUrl)
  //   .addTo(map)
  //   .on('done', function(layer) { 
  //     layer.setZIndex(2);
  //     var sublayer = layer.getSubLayer(0);
  //     sublayer.set(vacantBldgsGet);
  //     sublayers.push(sublayer);
  //     overlayLayers["VACANT BUILDINGS"] = layer;

  //     layer.setInteraction(true);

  //     layer.on('featureClick', function(e, pos, latlng, data) {
  //       showFeature(data.cartodb_id, pos)
  //     });

  //    }).on('error', function() { 
  //     //log the error
  //   });

  cartodb.createLayer(map, cartoUrl)
    .addTo(map)
    .on('done', function(layer) { 
      layer.setZIndex(3);
      var sublayer = layer.getSubLayer(0);
      sublayer.set(vacantLotsGet);
      sublayers.push(sublayer);
      overlayLayers["VACANT LOTS"] = layer;

      layer.setInteraction(true);

      layer.on('featureClick', function(e, pos, latlng, data) {
        showFeature(data.cartodb_id, pos)
      });

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

      layer.setInteraction(true);
      layer.on('featureClick', function(e, pos, latlng, data) {
        showFeature(data.cartodb_id, pos)
      });

     }).on('error', function() { 
      //log the error
    });

}
