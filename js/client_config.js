var config =
{
	city: "Trenton",
	southwest: L.latLng(40.18000, -74.85000),
    northeast: L.latLng(40.26000, -74.67000),
    rev_geocoding_apikey: 'AIzaSyAKf5AB_5QngOuThxqDCo8A8U17qpCBu00',
    database_name: 'master_properties',
    additional_attrib : 'Created by Iana Dikidjieva for <a href="http://www.restoringtrenton.org">Restoring Trenton</a><br>',
   	sql_url : 'http://restoring-trenton.cartodb.com/api/v2/sql?q=',
   	sidebar_content : "<h1>Advanced Search</h1>" +
	    "<form id='advanced_search' onSubmit='return advanced_geosearch();'>" +
	    "<fieldset>" +
	    "Street:<br>" +
	    "<input type='text' class='form-control' id='address'>" +
	    "<br>" +
	    "Owner (lastname, firstname):<br>" +
	    "<input type='text' class='form-control' id='owner'>" +
	    "<br>" +
	    "Lot Type:<br>" +
	    "<select id='parc_type'>" +
	    "<option value='any'>Select a lot type</option>" +
	    "<option value='VACANT BLDG'>Vacant Building</option>" +
	    "<option value='VACANT LOT'>Vacant Lot</option>" +
	    "<option value='OCCUPIED BLDG'>Occupied Building</option>" +
	    "</select>" +
	    "<br><br>" +
	    "Conditions for buildings:<br>" +
	    "<div class='checkbox'><label><input type = 'checkbox' id='b_dumping'>Dumping</option></label></div>" +
	    "<div class='checkbox'><label><input type = 'checkbox' id='b_trash'>Trash</option></label></div>" +
	    "<div class='checkbox'><label><input type = 'checkbox' id='b_xs'>Xs</option></label></div>" +
	    "<div class='checkbox'><label><input type = 'checkbox' id='b_dilapidated'>Dilapidated</option></label></div>" +
	    "<div class='checkbox'><label><input type = 'checkbox' id='b_unsecured'>Unsecured</option></label></div>" +
	    "<div class='checkbox'><label><input type = 'checkbox' id='b_animals'>Animals</option></label></div>" +
	    "Conditions for lots:<br>" +
	    "<div class='checkbox'><label><input type = 'checkbox' id='l_dumping'>Dumping</option></label></div>" +
	    "<div class='checkbox'><label><input type = 'checkbox' id='l_trash'>Trash</option></label></div>" +
	    "<div class='checkbox'><label><input type = 'checkbox' id='l_unmaintained'>Unmaintained</option></label></div>" +
	    "<div class='checkbox'><label><input type = 'checkbox' id='l_weeds'>Weeds</option></label></div>" +
	    "<br><br>" +
	    "Redevelopment area:<br>" +
	    "<select id='redev_area'>" +
	    "<option value='any'></option>" +
	    "<option value='in_redev'>In Redevelopment Area</option>" +
	    "<option value='not_redev'>Not In Redevelopment Area</option>" +
	    "</select>" +
	    "<br><br>" +
	    "<input type='submit' class='btn btn-primary' value='Go'>" +
	    "</fieldset>" +
	    "</form>" +
	    "</br></br></br>" +
	    "<button type='button' class='btn btn-primary' id='download'>Download Search Output</button>"
    ,
    search_results_limit : "10000"
}
