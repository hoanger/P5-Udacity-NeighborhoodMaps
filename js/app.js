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
function Place(obj) {
	var self = this;

	// set name and position from object
	self.name = obj.name;
	self.position = obj.position;

	// create marker based on position
	var opts = {};
	opts.position = self.position;
	self.marker = map.addMarker(opts);

	// set visibility of place
	self.vis = ko.observable(true);

	// subscribe to visibility change and sync with marker visibility
	self.vis.subscribe(function(newValue) {
		map.setMarkerVis(self.marker, newValue);
	});
}

// view model constructor
function AppViewModel() {
	var self = this;

	// dataset of dim sum restaurants
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

	// initiate variable to hold searchText
	self.searchText = ko.observable('');

	// subscribe to changes in search bar
	self.searchText.subscribe(function(newValue) {
		console.log(newValue);
		filterList(newValue);
	});

	// create places list from data
	getPlaces(self.data);

	// sort alphabetical by name
	self.places.sort(function (left, right) {
		return left.name == right.name ? 0 : (left.name < right.name ? -1 : 1)
	});

	// make editable dataset from data
	function getPlaces(dataset) {

		// create observable array
		self.places = ko.observableArray();

		// push each place to observable array using dataset
		dataset.forEach(function(datum) {
			self.places.push(new Place(datum));
		});
	}

	// searches text for any instance of input
	function isMatch(input, str) {
		var re = new RegExp(input, 'i');
		console.log("input is " + input + ", str is " + str);
		console.log(re.exec(str));
		return (re.exec(str) !== null);
	}

	// hides and shows list based on match
	function filterList(input) {
		self.places().forEach(function(place) {
			place.vis(isMatch(input, place.name));
		});
	}

}

// Initiate view model and apply bindings
var viewModel = new AppViewModel();
ko.applyBindings(viewModel);