function createMapLayer(map, cartoUrl, Zindex, sublayer) {
  cartodb.createLayer(map, cartoUrl)
    .addTo(map)
    .on('done', function(layer) {
      layer.setZIndex(Zindex);
      var sublayer = layer.getSubLayer(0);
      sublayer.set(sublayer);

      overlayLayers["Vacant Buildings"] = layer;

      layer.setInteraction(true);

      layer.on('featureClick', function(e, pos, latlng, data) {
        showFeature(data.cartodb_id, pos)
      });

    }).on('error', function() {
    })
}

function showFeature(cartodb_id, pos) {
  sql.execute("select the_geom, ST_AsGeoJSON(ST_Centroid(the_geom)) from " + config.database_name + " where cartodb_id = {{cartodb_id}}", {cartodb_id: cartodb_id} )
  .done(function(geojson) {
    makePolygon(geojson, isAdvancedSearch=false);
  });
}

function cleanAddress(qry_addr) {
  var cleaned_addr = 
    qry_addr.replace(/ street/ig, ' st')
    .replace(/ avenue/ig, ' ave')
    .replace(/ alley/ig, ' al')
  return cleaned_addr;
}

function runQuery(qry_addr, options) {
  var cleaned_addr = cleanAddress(qry_addr);
  console.log('running sql query: '+cleaned_addr);

  searchPolygons.forEach(function(entry) {
    map.removeLayer(entry);
  });
  searchResults = [];

  var query_string = "SELECT the_geom, address, cartodb_id, ST_AsGeoJSON(ST_Centroid(the_geom)) FROM " + config.database_name;
  query_string +=  " WHERE UPPER(address) LIKE UPPER('%25" + cleaned_addr + "%25')";
  if (options.parc_type != 'any')
    query_string += " AND parc_type = '" + options.parc_type + "'";
  query_string += " LIMIT " + config.search_results_limit;

  console.log('query string: ' + query_string);
  $.getJSON(config.sql_url+query_string, function(data) {
    $.each(data.rows, function(key, val) {
      query_string = "select *, ST_AsGeoJSON(ST_Centroid(the_geom)) from " + config.database_name + " where cartodb_id = " + val.cartodb_id;

      sql.execute(query_string)
      .done(function(geojson) {
        makePolygon(geojson, isAdvancedSearch=true);
        searchResults.push(geojson);
      });
    });
  });
}

function openPopup(coordinates) {
  console.log(coordinates);
  var latlng = L.latLng(coordinates[0], coordinates[1]);
  var g_latlng = new google.maps.LatLng(latlng.lat, latlng.lng);

  var geocoder = L.GeoSearch.Provider.Google.Geocoder;
  var addr = geocoder.geocode({'latLng': g_latlng}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) 
    {
      var address = results[0]['formatted_address'];
      
      var contentString = "<p>" + address + "</p><p>"
        + "<a href='feedback?address=" + address + "' target='_blank'>Send feedback about this address?</a></p>"
      popup
        .setLatLng(latlng)
        .setContent(contentString)
        .openOn(map);
    }
    else { console.log('error in opening popup'); console.log(coordinates)}
  });
}

function onEachFeature(feature, layer) {
  var centroid = JSON.parse(feature.properties.st_asgeojson).coordinates;
  // swap lat-lng
  var lat = centroid[1];
  var lng = centroid[0];
  centroid = [lat, lng];

  layer.on('click', function(e) {
    openPopup(centroid);
  });

}

function makePolygon(geojson, isAdvancedSearch) {
  if (polygon) {
    map.removeLayer(polygon);
  }
  if (isAdvancedSearch)
  {
    var multipolygon = L.geoJson(geojson, { 
      style: {
        color: "#E10",
        fillColor: "#E10",
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

    var centroid = JSON.parse(geojson.features[0].properties.st_asgeojson).coordinates;
    var lat = centroid[1];
    var lng = centroid[0];
    centroid = [lat, lng];
    openPopup(centroid);
  }
}


function formatJSON(searchResultsArr) {
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
}

