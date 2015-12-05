// map html element
var element = $("#map-canvas")[0];

// map options
var options = {
	center: {
		lat: 49.2375057,
		lng: -123.1354528
	},
	scrollwheel: false,
	zoom: 11,
	minZoom: 10,
	maxZoom: 15,
	zoomControlOptions: {
		position: google.maps.ControlPosition.LEFT_TOP
	}
};

// create map instance
var map = new Mapper(element, options);

// constructor for a place
function Place(nom, pos) {
	var self = this;
	// set name and position
	self.name = nom;
	self.position = pos;

	// create marker based on position
	var opts = {};
	opts.position = self.position;
	self.marker = map.addMarker(opts);

	// set visibility of place
	self.vis = ko.observable(true);
}

// view model constructor
function AppViewModel() {
	var self = this;

	// dataset
	self.data = [
		{
			name: 'Kirin - Downtown',
			position: { lat: 49.286353, lng: -123.125604 }
		},
		{
			name: 'Kirin - City Square',
			position: { lat: 49.260877, lng: -123.116371 }
		},
		{
			name: 'Kirin - Richmond',
			position: { lat: 49.169944, lng: -123.137695 }
		},
		{
			name: 'Kirin - Starlight Casino',
			position: { lat: 49.186306, lng: -122.956295 }
		},
		{
			name: 'Sun Sui Wah - Richmond',
			position: {	lat: 49.178177,	lng: -123.135593 }
		},
		{
			name: 'Sun Sui Wah - Vancouver',
			position: {	lat: 49.250524,	lng: -123.100606 }
		},
		{
			name: 'Dragon View',
			position: { lat: 49.185102,	lng: -123.129039 }
		},
		{
			name: 'Prince Seafood Restaurant',
			position: {	lat: 49.258389,	lng: -123.045128 }
		},
		{
			name: 'Fisherman\'s Terrace',
			position: {	lat: 49.183874,	lng: -123.133822 }
		}
	];

	// make editable dataset from data
	self.places = ko.observableArray();
	for (i = 0; i < self.data.length; i++) {
		self.places.push(new Place(self.data[i].name, self.data[i].position));
	}
}

// Initiate view model and apply bindings
var viewModel = new AppViewModel();
ko.applyBindings(viewModel);