var config =
{
	city: "Trenton",
	southwest: L.latLng(40.18000, -74.85000),
    northeast: L.latLng(40.26000, -74.67000),
    rev_geocoding_apikey: 'AIzaSyAKf5AB_5QngOuThxqDCo8A8U17qpCBu00',
    database_name: 'master_properties',
    additional_attrib : 'Created by Iana Dikidjieva for <a href="http://www.restoringtrenton.org">Restoring Trenton</a><br>',
   	sql_url : 'http://restoring-trenton.cartodb.com/api/v2/sql?q=',
   	sidebar_content : "<h1>Advanced Search</h1>\
	    <form id='advanced_search' onSubmit='return advanced_geosearch();'>\
	    <fieldset>\
	    Address:<br>\
	    <input type='text' class='form-control' id='address'>\
	    <br>\
	    Lot Type:<br>\
	    <select id='parc_type'>\
	    <option value='any'>Select a lot type</option>\
	    <option value='VACANT BLDG'>Vacant Building</option>\
	    <option value='VACANT LOT'>Vacant Lot</option>\
	    <option value='OCCUPIED BLDG'>Occupied Building</option>\
	    </select>\
	    <br><br>\
	    Condition:<br>\
	    <select id='condition'>\
	    <option value='any'>Select a condition</option>\
	    <option value='dumping'>Dumping</option>\
	    <option value='trash'>Trash</option>\
	    <option value='xs'>Xs</option>\
	    <option value='dilapidated'>Dilapidated</option>\
	    <option value='unsecured'>Unsecured</option>\
	    <option value='animals'>Animals</option>\
	    </select>\
	    <br><br>\
	    <input type='submit' class='btn btn-primary' value='Go'>\
	    </fieldset>\
	    </form>\
	    </br></br></br>\
	    <button type='button' class='btn btn-primary' id='download'>Download Search Output</button>\
    ",
    search_results_limit : "100"
}
