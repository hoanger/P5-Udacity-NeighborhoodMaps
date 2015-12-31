(function(window, mapper) {

	// to hold our viewmodel
	var viewModel;
	// map html element
	var element = $("#map-canvas")[0];
	// get map options
	var options = mapper.MAP_OPTIONS;
	// create map instance
	var map = new Mapper(element, options);
	// function to get places data
	var data = function() {
		// this can be modified to retrieve data from another source
		return myData;
	};

	// constructor for a place
	function Place(obj) {
		var self = this;
		// marker options
		var markerOpts = {
			position: obj.position,
		};
		self.name = obj.name;
		// set marker id to be the same as name
		markerOpts.id = self.name;
		map.addMarker(markerOpts);

		// set visibility of place item
		self.vis = ko.observable(true);
		// subscribe to visibility change and sync with its marker visibility
		self.vis.subscribe(function(newValue) {
			map.setVis(newValue, function(marker) {
				return marker.id === self.name;
			});
		});
	}


	// View Model
	function AppViewModel() {
		var self = this;
		// initiate variable to hold searchText
		self.searchText = ko.observable('');
		// subscribe to changes in search bar
		self.searchText.subscribe(function(newValue) {
			filterPlaces(newValue);
		});
		// create observable array
		self.places = ko.observableArray();

		// create places list from data
		getPlaces(data());

		// push editable dataset from data
		function getPlaces(dataset) {
			// push each place to observable array using dataset
			dataset.forEach(function(datum) {
				self.places.push(new Place(datum));
			});
			// sort alphabetical by name
			self.places.sort(function (left, right) {
				return left.name == right.name ? 0 : (left.name < right.name ? -1 : 1)
			});
		}

		// hides and shows places list based on match
		function filterPlaces(input) {
			self.places().forEach(function(place) {
				place.vis(isMatch(input, place.name));
			});
		}
	}

	// Initiate view model and apply bindings
	viewModel = new AppViewModel();
	ko.applyBindings(viewModel);

	// searches text for any instance of input
	//returns true if params match, false if they don't
	function isMatch(input, str) {
		var re = new RegExp(input, 'i');
		return (re.exec(str) !== null);
	}

})(window, window.Mapper);