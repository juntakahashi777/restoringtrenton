//this file sets up most of the actual map, with the different layers.



var map;
var sql = new cartodb.SQL({ user: 'restoring-trenton', format: 'geojson' });
var polygon;
var searchPolygons = [];
var searchResults = [];
var searchModule;
var sidebar;

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
 
 // insert the auctions link here when there are auctions posted
 // var auctionURL = '...'
  
  //basic parcel outlines
  cartodb.createLayer(map, cartoUrl)
    .addTo(map)
    .on('done', function(layer) { 
      layer.setZIndex(1);
      var sublayer = layer.getSubLayer(0);
      sublayer.set(allPropsGet);
      sublayers.push(sublayer);
      overlayLayers["PROPERTY OUTLINES"] = layer;

      layer.setInteraction(false);

     }).on('error', function() { 
      //log the error
    });

 //insert basemap
  var stamen = L.tileLayer('http://a.tile.stamen.com/toner-lite/{z}/{x}/{y}.png', {attribution: config.additional_attrib + '<a href="http://stamen.com">Stamen basemaps</a>'});
  stamen.addTo(map);

  var bases = { "STAMEN TONER LITE BASEMAP": stamen };


  //identifying and styling the different types of parcels -- add any others here

  var allPropsGet = {
    sql: "SELECT * FROM " + config.database_name,
    cartocss: "#trenton_properties{polygon-fill: #fff; polygon-opacity:0;line-color:#999; line-opacity:0.2;} #trenton_properties[parc_type='OPEN SPACE OR CEMETERY'] {polygon-fill:#259073; polygon-opacity:.3;}",
  }
  
  var vacantLotsGet = {
    sql: "SELECT * FROM " + config.database_name + " where parc_type = 'VACANT LOT'",
    cartocss: "#trenton_properties{polygon-fill: #B9D132; polygon-opacity:0.5;line-color:#fff; line-opacity:0.2;}",
  }

  var vacantBldgsGet = {
	//add any other conditions to the SQL if certain vacant bldgs should not be displayed, eg and waiv_type is not 'NONE OR N/A'	  
    sql: "SELECT * FROM " + config.database_name + " where parc_type = 'VACANT BLDG'",
    cartocss: "#trenton_properties{polygon-fill: #FF0000; polygon-opacity:0.5;line-color: #fff; line-opacity:0.2;}"
  }
  
    var vacantLowerGet = {	  
    sql: "SELECT * FROM " + config.database_name + " where parc_type = 'VACANT LOWER'",
    cartocss: "#trenton_properties{polygon-fill: #FF9900; polygon-opacity:0.6;line-color: #fff; line-opacity:0.2;}"
  }

  var lienPropsGet = {
    sql: "SELECT * FROM " + config.database_name + " where (city_liens > 0 or priv_liens > 0)",
    cartocss: "#trenton_properties{polygon-fill: #000; polygon-opacity:0.2;line-color:#000 ; line-width: 2; line-opacity:0.5;}"
  }
  
    var cityOwnedVacGet = {
    sql: "SELECT * FROM " + config.database_name + " where (owner like '%CITY OF TRENTON%' and parc_type like '%VACANT%')",
    cartocss: "#trenton_properties{polygon-opacity:0;line-color:#0000FF; line-width: 2; line-opacity:0.6;}"
  }

 // var homesteadGet = {
 //   sql: "SELECT * FROM " + config.database_name + " where owner = 'CITY OF TRENTON' and class = '2' and parc_type = 'VACANT BLDG' and redev_area is not NULL",
 //   cartocss: "#trenton_properties{polygon-fill: #00FBFF; polygon-opacity:0.2;line-color:#00FBFF ; line-width: 3; line-opacity:0.8;}"
 // }

 /* var auctionsGet = {
	 sql: "SELECT * FROM auctionURL",
	 cartocss: "#auctions{polygon-fill:...; ...}"
 }
 */
 
/*  var invisibleLayer = {
    sql: "SELECT * FROM " + config.database_name + " ",
    cartocss: "#trenton_properties{polygon-opacity:0;line-color:#fff ; line-width: 1; line-opacity:0;}"

  }
*/
  
  
  //don't forget to add any new layers to the menu!
  var sublayers = [allPropsGet, vacantLotsGet, vacantBldgsGet, vacantLowerGet, lienPropsGet, cityOwnedVacGet];

  // Add navbar module

//  L.control.navbar().addTo(map);

  // -------------------------
  // Add annoying Google search for the basic address line search at the top (this does not query the actual dB)
/*
  searchModule = new L.Control.GeoSearch({
      provider: new L.GeoSearch.Provider.Google()
  }).addTo(map);

  L.easyButton('fa-search', 
              function (){
                sidebar.toggle();
              },
             'Open Advanced Search'
            );
  
  // -------------------------
  // Add sidebar module

  var div_sidebar = document.createElement('div');
  div_sidebar.id = "sidebar";
  $('body')[0].appendChild(div_sidebar);

  sidebar = L.control.sidebar('sidebar', {
      position: 'left'
  });

  map.addControl(sidebar);
  sidebar.setContent(config.sidebar_content);
  // -------------------------

  $(document).ready(function(){
    $('#download').click(function(){
      if (searchResults.length == 0)
      {
        alert('please run a search first!');
      }
      else
      {
        formatJSON(searchResults);
      }
    });
  });
*/

  //array to hold the different overlay layers we're creating from different queries of the property database)

  overlayLayers = {};

//here are the buildings  
  cartodb.createLayer(map, cartoUrl)
    .addTo(map)
    .on('done', function(layer) { 
      layer.setZIndex(2);
      var sublayer = layer.getSubLayer(0);
      sublayer.set(vacantBldgsGet);
      sublayers.push(sublayer);
      overlayLayers["VACANT BUILDINGS"] = layer;

      layer.setInteraction(true);

      layer.on('featureClick', function(e, pos, latlng, data) {
      showFeature(data.cartodb_id, pos)
      });

     }).on('error', function() { 
      //log the error
    });

//vacant lots	
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

//taking out the homestead layer since they changed the conditions	
/*  cartodb.createLayer(map, cartoUrl)
    .addTo(map)
    .on('done', function(layer) { 
      layer.setZIndex(4);
      var sublayer = layer.getSubLayer(0);
      sublayer.set(homesteadGet);
      sublayers.push(sublayer);
      overlayLayers["POSSIBLE HOMESTEADS"] = layer;

     }).on('error', function() { 
      //log the error
    });
*/

//vacant ground floor
    cartodb.createLayer(map, cartoUrl)
    .addTo(map)
    .on('done', function(layer) { 
      layer.setZIndex(4);
      var sublayer = layer.getSubLayer(0);
      sublayer.set(vacantLowerGet);
      sublayers.push(sublayer);
      overlayLayers["VACANT GROUND FLOOR"] = layer;
	  layer.setInteraction(true);

      layer.on('featureClick', function(e, pos, latlng, data) {
      showFeature(data.cartodb_id, pos)
      });

     }).on('error', function() { 
      //log the error
    });

//enable the auction layer when there's an upcoming auction	
/*  cartodb.createLayer(map, cartoUrl)
    .addTo(map)
    .on('done', function(layer) { 
      layer.setZIndex(5);
      var sublayer = layer.getSubLayer(0);
      sublayer.set(auctionGet);
      sublayers.push(sublayer);
      overlayLayers["AUCTIONS"] = layer;

     }).on('error', function() { 
      //log the error
    });
*/

//city-owned vacants
 cartodb.createLayer(map, cartoUrl)
    .on('done', function(layer) { 
      layer.setZIndex(10);
      var sublayer = layer.getSubLayer(0);
      sublayer.set(cityOwnedVacGet);
      sublayers.push(sublayer);
      overlayLayers["CITY-OWNED VACANTS"] = layer;


     }).on('error', function() { 
      //log the error
    });	
	
//liens, whoo
  cartodb.createLayer(map, cartoUrl)
    .on('done', function(layer) { 
      layer.setZIndex(5);
      var sublayer = layer.getSubLayer(0);
      sublayer.set(lienPropsGet);
      sublayers.push(sublayer);
      overlayLayers["TAX LIENS"] = layer;
	  	  L.control.layers(null, overlayLayers, {position:'topright'}).addTo(map);


     }).on('error', function() { 
      //log the error
    });


	

	  
  //the next one is a general info layer for all properties - turn it on to have hover popups for all props, etc.
  
  /*cartodb.createLayer(map, cartoUrl)
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
*/



}
/*
function showFeature(cartodb_id, pos) {
  sql.execute("select *, ST_AsGeoJSON(ST_Centroid(the_geom)) from " + config.database_name + " where cartodb_id = {{cartodb_id}}", {cartodb_id: cartodb_id} )
  .done(function(geojson) {
    makePolygon(geojson);
  });
}

function makePolygon(geojson) {
 // if (polygon) {
 //   map.removeLayer(polygon);
 // }
    polygon = L.geoJson(geojson, {
      style: {
        color: "#fff",
        fillColor: "#fff",
        weight: 2,
        opacity: 0.65
      }
    }).addTo(map);

    var centroid = JSON.parse(geojson.features[0].properties.st_asgeojson).coordinates;
    var lat = centroid[1];
    var lng = centroid[0];
    centroid = [lat, lng];
    openPopup(centroid, geojson.features[0]);

}


function openPopup(coordinates, feature) {
  console.log(feature);
  var latlng = L.latLng(coordinates[0], coordinates[1]);
  var g_latlng = new google.maps.LatLng(latlng.lat, latlng.lng);

  var contentString = "<b>" + feature.properties.address + "</B></BR>" + feature.properties.parc_type + "</B><BR><BR><B> OWNED BY </B><br>" + feature.properties.owner + "<br>" + feature.properties.ownstreet + "<br>" + feature.properties.owncity + "<P> <B>ADVERSE CONDITIONS</B>: " + feature.properties.conditions + "</P><P><a href='feedback?address=" + feature.properties.cartodb_id + "' target='_blank'>REPORT AN ISSUE</a></P>"
        
  popup
    .setLatLng(latlng)
    .setContent(contentString)
    .openOn(map);
}

function onEachFeature(feature, layer) {
  var centroid = JSON.parse(feature.properties.st_asgeojson).coordinates;
  // swap lat-lng
  var lat = centroid[1];
  var lng = centroid[0];
  centroid = [lat, lng];

  layer.on('click', function(e) {
    openPopup(centroid, feature);
  });

}
 */