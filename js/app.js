var runApp = function(window, mapper) {

	// to hold our viewmodel
	var viewModel;
	// map html element
	var element = $("#map-canvas")[0];
	// get map options
	var options = mapper.MAP_OPTIONS;
	options.zoomControlOptions = { position: google.maps.ControlPosition.LEFT_TOP };
	// create map instance
	var map = new Mapper(element, options);
	// function to get places data
	var data = function() {
		// this can be modified to retrieve data from another source
		return myData;
	};

	/**
	* @description View Model
	* @constructor
	*/
	function AppViewModel() {
		var self = this;
		var arr;
		// initiate variable to hold searchText
		self.searchText = ko.observable('');
		// subscribe to changes in searchText and run filterPlaces() on change
		self.searchText.subscribe(function(newValue) {
			filterPlaces(newValue);
		});

		// create places list from data
		arr = getPlaces(data());
		self.places = ko.observableArray(arr);

		/**
		* @description Get dataset from data into an array in alphabetical order
		* @param {array} dataset - array of objects (places)
		* @returns array of objects sorted alphabetically by name
		*/
		function getPlaces(dataset) {
			// push each place to observable array using dataset
			var placesArr = [];
			dataset.forEach(function(datum) {
				placesArr.push(new Place(datum));
			});
			// sort alphabetical by name
			placesArr.sort(function (left, right) {
				return left.name == right.name ? 0 : (left.name < right.name ? -1 : 1);
			});
			return placesArr;
		}

		/**
		* @description Change visibility of place list item depending on match with input
		* param {string} input
		*/
		function filterPlaces(input) {
			self.places().forEach(function(place) {
				place.vis(isMatch(input, place.name));
			});
		}
	}

	// Initiate view model and apply bindings
	viewModel = new AppViewModel();
	ko.applyBindings(viewModel);

	/**
	* @description Constructor for a place
	* @constructor
	* param {object} obj - place data used to construct the place
	*/
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
			// if filter makes a marker disappear, then close infowindow
			if (!newValue) {
				map.closeInfowindow();
			}
		});
		// call choosePlace() when the list item is clicked
		self.clicked = function(){
			choosePlace(self.name);
		};
	}

	/**
	* @description compares two strings and checks if one is a subset of the other
	* @param {string} input - subset string of characters used to compare
	* @param {string} str - main string to find subset in
	* @returns true if input is found in str, false otherwise
	*/
	function isMatch(input, str) {
		var re = new RegExp(input, 'i');
		return (re.exec(str) !== null);
	}

	/**
	* @description Indicate chosen marker that matches a place item
	* @param {string} placeId - identifier for a place
	*/
	function choosePlace(placeId) {
		map.chooseMarker(function(marker) {
			return marker.id === placeId;
		});
	}

	/**
	* @description Set visibility of a marker with given id
	* @param {string} placeId - identifier for a place
	* @param {boolean} newVis - visibility to set for the marker
	*/
	function visPlace(placeId, newVis) {
		map.setVis(newVis, function(marker) {
			return marker.id === placeId;
		});
	}
};