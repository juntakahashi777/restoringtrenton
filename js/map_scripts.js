//this file sets up searchability and popup contents based on json. We have pulled the popup into the map_init file but the full code is hidden here.

function advanced_geosearch () {
  var options = {};
  options.address = $('#address')[0].value;
  options.parc_type = $('#parc_type')[0].value;
  options.redev_area = $('#address')[0].value;

  try {
    //searchModule.geosearch(address);
    runQuery(options);
    sidebar.hide();
  }
  catch (error) {
  }

  // returns false in order to prevent page redirect on form submit    
  return false;
}


/*function showFeature(cartodb_id, pos) {
  sql.execute("select *, ST_AsGeoJSON(ST_Centroid(the_geom)) from " + config.database_name + " where cartodb_id = {{cartodb_id}}", {cartodb_id: cartodb_id} )
  .done(function(geojson) {
    foundPolygon(geojson, isAdvancedSearch=false);
  });
}*/

/*function cleanAddress(qry_addr) {
  var cleaned_addr = 
    qry_addr.replace(/ street/ig, ' st')
    .replace(/ avenue/ig, ' ave')
    .replace(/ alley/ig, ' al')
  return cleaned_addr;
}*/

function runQuery(options) {
//  var cleaned_addr = cleanAddress(qry_addr);
//  console.log('running sql query: '+cleaned_addr);

/*  searchPolygons.forEach(function(entry) {
    map.removeLayer(entry);
  });*/
  
  
 // searchResults = [];

 //setting up what we're going to ask the database for
  var query_string = "SELECT FROM " + config.database_name + "WHERE ";
  
  var query_add = $('#address').val();
  if (query_add !='') {
  query_string +=  "UPPER(address) LIKE UPPER('" + query_add + "')";
  }

  var owner = $('#owner').val();
  if (owner != '')
    query_string += " AND owner LIKE UPPER('" + owner + "')";
  
  if (options.parc_type != 'any')
    query_string += " AND parc_type = '" + options.parc_type + "'";


  var conditions = {animals:'ANIMALS', dilapidated:'DILAPIDATED', dumping:'DUMPING', trash:'TRASH', unsecured:'UNSECURED', xs:'XS', unmaintained:'UNMAINTAINED', weeds:'WEEDS'}
 // var condition_string = '';
  for (cond_id in conditions)
  {
    if ($('#'+cond_id).is(":checked"))
    {
      // console.log(building_conditions[b_id]);
      query_string += "AND conditions LIKE '%25" + conditions[cond_id] + "%25'";
    }
  }
  
  if (options.redev_area != 'any')
    query_string += " AND redev_area is not NULL";

  query_string += " LIMIT " + config.search_results_limit;

  
  console.log('query string: ' + query_string);
  /*$.getJSON(config.sql_url+query_string, function(data) {
    $.each(data.rows, function(key, val) {
      query_string = "select *, ST_AsGeoJSON(ST_Centroid(the_geom)) from " + config.database_name + " where cartodb_id = " + val.cartodb_id;

      sql.execute(query_string)
      .done(function(geojson) {
        foundPolygon(geojson, isAdvancedSearch=true);
        searchResults.push(geojson);
      });
    });
  });
}*/

//create query layer
  var queryGet = {
    sql: query_string,
    cartocss: "#trenton_properties{polygon-fill: #00FFFF; polygon-opacity:0;line-color:#00FFFF; line-opacity:0.7;}",
  }

  cartodb.createLayer(map, config.sql_url)
    .addTo(map)
    .on('done', function(layer) { 
      layer.setZIndex(10);
      var sublayer = layer.getSubLayer(0);
      sublayer.set(queryGet);
      sublayers.push(sublayer);

      layer.setInteraction(true);

     }).on('error', function() { 
      //log the error
    });
}
/*function foundPolygon(geojson, isAdvancedSearch) {
  if (polygon) {
    map.removeLayer(polygon);
  } 
  if (isAdvancedSearch)
  {
    var multipolygon = L.geoJson(geojson, { 
      style: {
        color: "#00FFFF",
        fillColor: "#00FFFF",
        weight: 2.5,
        opacity: 0.95
      },
      onEachFeature : onEachFeature
    }).addTo(map);
    searchPolygons.push(multipolygon);
  }
  else
  {
    polygon = L.geoJson(geojson, {
      style: {
        color: "#fff",
        fillColor: "#fff",
        weight: 2,
        opacity: 0.65
      }
    }).addTo(map);

/*
    var centroid = JSON.parse(geojson.features[0].properties.st_asgeojson).coordinates;
    var lat = centroid[1];
    var lng = centroid[0];
    centroid = [lat, lng];
    openPopup(centroid, geojson.features[0]);
  }
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

/*function formatJSON(searchResultsArr) {
  var featuresArr = [];
  var propertiesArr = [];
  console.log(JSON.stringify(searchResultsArr[0]));
  searchResultsArr.forEach(function(entry) {
    // console.log(entry);
    featuresArr.push(entry.features[0]);
    propertiesArr.push(entry.properties);
  });

  var json = {
    type:"FeatureCollection",
    features:featuresArr,
  };


  var uri = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(json));
  window.open(uri, '_blank');
  window.focus();  
} */

