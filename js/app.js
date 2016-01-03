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

	// View Model
	function AppViewModel() {
		var self = this;
		var arr;
		// initiate variable to hold searchText
		self.searchText = ko.observable('');
		// subscribe to changes in search bar
		self.searchText.subscribe(function(newValue) {
			filterPlaces(newValue);
		});

		// create places list from data
		arr = getPlaces(data());

		// create observable array from array of data
		self.places = ko.observableArray(arr);

		// get editable dataset from data into an array
		function getPlaces(dataset) {
			// push each place to observable array using dataset
			var placesArr = [];
			dataset.forEach(function(datum) {
				placesArr.push(new Place(datum));
			});
			// sort alphabetical by name
			placesArr.sort(function (left, right) {
				return left.name == right.name ? 0 : (left.name < right.name ? -1 : 1)
			});
			return placesArr;
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

	// constructor for a place
	function Place(obj) {
		var self = this;
		// marker options
		var markerOpts = {
			position: obj.position,
			fsqid: obj.fsqid,
			id: obj.name
		};
		// Set place name
		self.name = obj.name;
		// add marker using options
		map.addMarker(markerOpts);
		// set visibility of place item
		self.vis = ko.observable(true);
		// subscribe to visibility change and sync with its marker visibility
		self.vis.subscribe(function(newValue) {
			visPlace(self.name, newValue);
		});
		// function runs when a place is clicked
		self.clicked = function(){
			choosePlace(self.name);
		};
	}

	// searches text for any instance of input
	// returns true if params match, false if they don't
	function isMatch(input, str) {
		var re = new RegExp(input, 'i');
		return (re.exec(str) !== null);
	}

	// bounces marker with marker id matching input
	function choosePlace(placeId) {
		map.chooseMarker(function(marker) {
			return marker.id === placeId;
		});
	}
	// sets visibility of a marker with marker id matching input
	function visPlace(placeId, newVis) {
		map.setVis(newVis, function(marker) {
			return marker.id === placeId;
		});
	}

})(window, window.Mapper);