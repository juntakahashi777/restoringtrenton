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
    else { alert('bad'); }
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
  var query_string = 'SELECT * FROM ' + config.database_name + ' LIMIT 10'

  $.getJSON(sql_url+query_string, function(data) {
    $.each(data.rows, function(key, val) {
      address = val.address

      var geocoder = L.GeoSearch.Provider.Google.Geocoder;
      geocoder.geocode( { 'address': address}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        // console.log(results[0].geometry.location);
        console.log(results[0].formatted_address);
        // map.setCenter(results[0].geometry.location);
        // var marker = new google.maps.Marker({
        //     map: map,
        //     position: results[0].geometry.location
        // });
      } else {
        console.log("Geocode was not successful for the following reason: " + status);
      }
    });
    });
  });
}