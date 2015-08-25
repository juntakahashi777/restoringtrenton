//this is just the sidebar input
var config =
{
	city: "Trenton",
	southwest: L.latLng(40.18000, -74.85000),
    northeast: L.latLng(40.26000, -74.67000),
    rev_geocoding_apikey: 'AIzaSyAKf5AB_5QngOuThxqDCo8A8U17qpCBu00',
    database_name: 'master_properties',
    additional_attrib : 'Created by Iana Dikidjieva + Jun Takahashi for <a href="http://www.restoringtrenton.org">Restoring Trenton</a>.<br>',
   	sql_url : 'http://restoring-trenton.cartodb.com/api/v2/sql?q=',
    sidebar_content : "<h3>ADVANCED SEARCH</h3><b>Note</b>: entering more specifications will search for properties with ALL those specifications. We are tinkering so you can also find properties with ANY of the specifications - bear with us for a sec. <br><BR>" +
	    "<form id='advanced_search' onSubmit='return advanced_geosearch();'>" +
	    "<fieldset>" +
	    "<B>STREET</B>" +
	    "<input type='text' class='form-control' id='address'>" +
	    "<br>" +
	    "<B>OWNER</B> (LAST, FIRST):<br>" +
	    "<input type='text' class='form-control' id='owner'>" +
	    "<br>" +
	    "<B>PROPERTY TYPE</B>:<br>" +
	    "<select id='parc_type'>" +
	    "<option value='any'>ANY</option>" +
	    "<option value='VACANT BLDG'>VACANT BUILDING</option>" +
	    "<option value='VACANT LOT'>VACANT LOT</option>" +
	    "</select>" +
	    "<br><HR>" +
	    "<B>CONDITIONS</B><br>" +
		"<div class='checkbox'><label><input type = 'checkbox' id='dumping'>DUMPING</option></label></div>" +
	    "<div class='checkbox'><label><input type = 'checkbox' id='trash'>TRASH</option></label></div>" + 
	    "<div class='checkbox'><label><input type = 'checkbox' id='xs'>Xs</option></label></div>" +
	    "<div class='checkbox'><label><input type = 'checkbox' id='dilapidated'>DILAPIDATED</option></label></div>" +
	    "<div class='checkbox'><label><input type = 'checkbox' id='unsecured'>UNSECURED</option></label></div>" +
	    "<div class='checkbox'><label><input type = 'checkbox' id='animals'>ANIMALS</option></label></div>" +
		"<div class='checkbox'><label><input type = 'checkbox' id='unmaintained'>UNMAINTAINED</option></label></div>" +
	    "<div class='checkbox'><label><input type = 'checkbox' id='weeds'>WEEDS</option></label></div>" +
	    "<HR>" +
	    "<B>INSIDE A REDEVELOPMENT AREA?</B><br>" +
	    "<select id='redev_area'>" +
	    "<option value='any'></option>" +
	    "<option value='in_redev'>YES</option>" +
	    "<option value='not_redev'>NO</option>" +
	    "</select>" +
	    "<br><br>" +
	    "<input type='submit' class='btn btn-primary' value='Go'>" +
	    "</fieldset>" +
	    "</form>" +
	    "</br></br></br>" 
	   // "<button type='button' class='btn btn-primary' id='download'>Download Search Output</button>"
    ,
    search_results_limit : "10000" 
}
