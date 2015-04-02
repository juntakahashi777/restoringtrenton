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
  sql.execute("select the_geom from master_properties where cartodb_id = {{cartodb_id}}", {cartodb_id: cartodb_id} ).done(function(geojson) {
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
  var sql_url = 'http://restoring-trenton.cartodb.com/api/v2/sql?q='
  var query_string = "SELECT address, cartodb_id, ST_AsGeoJSON(ST_Centroid(the_geom)) FROM " + config.database_name + 
    " WHERE UPPER(address) LIKE UPPER('%25" + sql_query + "%25') LIMIT 10"

    console.log(query_string)
  $.getJSON(sql_url+query_string, function(data) {
    console.log(data)
    $.each(data.rows, function(key, val) {
      L.marker(JSON.parse(val.st_asgeojson)["coordinates"].reverse())
        .addTo(map)
        .bindPopup("<p>" + val.address + "</p><p>"
        + "<a href='feedback?address=" + val.address + "'>Send feedback about this address?</a></p>")
      // showFeature(val.cartodb_id, JSON.parse(val.st_asgeojson)["coordinates"].reverse())
    });
  });
}