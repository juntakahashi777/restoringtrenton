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


function openPopup(pos) {
  var latlng = L.latLng(pos[0], pos[1]);
  var g_latlng = new google.maps.LatLng(latlng.lat, latlng.lng);

  var geocoder = L.GeoSearch.Provider.Google.Geocoder;
  var addr = geocoder.geocode({'latLng': g_latlng}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) 
    {
      var address = results[0]['formatted_address'];
      
      var contentString = "<p>" + address + "</p><p>"
        + "<a href='feedback?address=" + address + "'>Send feedback about this address?</a></p>"
      popup
        .setLatLng(latlng)
        .setContent(contentString)
        .openOn(map);
    }
    else { console.log('error in opening popup'); console.log(pos)}
  });
}

function showFeature(cartodb_id, pos) {
  sql.execute("select the_geom from " + config.database_name + " where cartodb_id = {{cartodb_id}}", {cartodb_id: cartodb_id} )
  .done(function(geojson) {
    if (polygon) {
      map.removeLayer(polygon);
    }

    polygon = L.geoJson(geojson, { 
      style: {
        color: "#fff",
        fillColor: "#fff",
        weight: 2,
        opacity: 0.65
      }
    }).addTo(map);

    openPopup(pos);
  });
}

function runQuery(sql_query) {
  console.log('Running Query: ' + sql_query);
  var query_string = "SELECT the_geom, address, cartodb_id, ST_AsGeoJSON(ST_Centroid(the_geom)) FROM " + config.database_name + 
    " WHERE UPPER(address) LIKE UPPER('%25" + sql_query + "%25') LIMIT 10"

  $.getJSON(config.sql_url+query_string, function(data) {
    $.each(data.rows, function(key, val) {
      sql.execute("select the_geom from " + config.database_name + " where cartodb_id = {{cartodb_id}}", {cartodb_id: val.cartodb_id} )
      .done(makePolygon);
    });
  });
}

function makePolygon(geojson) {
  colorStr = "#111";
  L.geoJson(geojson, { 
    style: {
      color: colorStr,
      fillColor: colorStr,
      weight: 2,
      opacity: 0.65
    },
    onEachFeature: showFeature
  }).addTo(map);

}

