function latlng_reverse_geocoding(latlng) {
	var g_latlng = new google.maps.LatLng(latlng.lat, latlng.lng);

	// alert(g_latlng);
	geocoder.geocode({'latLng': g_latlng}, function(results, status) {
		alert('hello');
	});
}

function openPopup(pos) {
  var latlng = L.latLng(pos[0], pos[1]);

  latlng_reverse_geocoding(latlng);

  var contentString = "You clicked the map at " + pos + "\n\n"
    + "<a href='feedback?latlng=" + pos + "'>Send feedback?</a>"
  popup
    .setLatLng(latlng)
    .setContent(contentString)
    .openOn(map);
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