(function(window, markerer) {
	var Mapper = (function() {
		/**
		* @description Object to hold all values and functions related to the map
		* @constructor
		* @param {object} el - Element to hold map
		* @param {object} opts - map options
		*/
		function Mapper(el, opts) {
			this.googleMap = new google.maps.Map(el, opts);
			this.markers = new Markerer();
			// Google best practices call for only one info window to reduce clutter
			this.infowindow = new google.maps.InfoWindow();
		}
		Mapper.prototype = {
			/**
			* @description Create and add a marker to list of markers
			* @param {object} opts - holds marker options
			*/
			addMarker: function(opts) {
				var self = this;
				var marker;
				opts.map = this.googleMap;
				marker = new google.maps.Marker(opts);
				this.markers.add(marker);
				// add listener to marker to bounce and display info window
				marker.addListener('click', function(){
					self._selectMarker(this);
				});
			},
			/**
			* @description Set visibility of markers
			* @param {boolean} newVal - new visibility value
			* @param {function: returns boolean} callback - callback function to deterine which marker to set
			*/
			setVis: function(newVal, callback) {
				this.markers.find(callback, function(markers) {
					markers.forEach(function(marker) {
						marker.setVisible(newVal);
					});
				});
			},
			/**
			* @description Choose a marker
			* @param {function: returns boolean} callback - callback function to deterine which marker to select
			*/
			chooseMarker: function(callback) {
				var self = this;
				this.markers.find(callback, function(markers) {
					markers.forEach(function(marker){
						self._selectMarker(marker);
					});
				});
			},
			/**
			* @description Close the info window
			*/
			closeInfowindow: function() {
				this.infowindow.close();
			},
			/**
			* @description Private function to bounce a marker and set/show info window
			* @param {object} mkr - the marker to be selected
			*/
			_selectMarker: function(mkr) {
				var self = this;
				var venueInfo ={};
				// get foursquare data if it exists, otherwise show hardcoded information
				if (mkr.fsqid) {
						self._getFoursquare(mkr.fsqid);
				} else {
					venueInfo = {
						name: mkr.id,
						phone: "No info available from Foursquare."
					};
					self._setInfoWindow(venueInfo);
				}
				self._bounceMarker(mkr, 700);
				self._dimMarker(mkr);
				self._showInfoWindow(mkr);
			},
			/**
			* @description Private function to bounce a marker
			* @param {object} mkr - the marker to be selected
			* @param {integer} time - time period to bounce marker
			*/
			_bounceMarker: function(mkr, time) {
				mkr.setAnimation(google.maps.Animation.BOUNCE);
					window.setTimeout(function(){
					mkr.setAnimation(null);
				}, time);
			},
			/**
			* @description Private function to dim a marker
			* @param {object} mkr - the marker to be dimmed
			*/
			_dimMarker: function(mkr) {
				var self = this;
				// reset all marker opacities to 100%
				var allMarkers = this.markers;
				allMarkers.markers.forEach(function(marker){
					marker.setOpacity(1);
				});
				// dim the selected marker
				mkr.setOpacity(0.5);
			},
			/**
			* @description Private function to display info window
			* @param {object} mkr - the marker to be selected
			*/
			_showInfoWindow: function(mkr){
				this.infowindow.open(this.googleMap, mkr);
			},
			/**
			* @description Private function to set content of info window
			* @param {object} vInfo - data used for info window content
			*/
			_setInfoWindow: function(vInfo){
				//initialize base infowindow information
				var info = '<br /><br /><br /><span style="text-align:center";>Loading Foursquare data...</span><br /><br /><br />';
				var fsqAttribution = '<img src="images/pb-foursquare.png">';
				if (vInfo){
					info = "<p>Name: " + vInfo.name + "</p><p>Phone: " + vInfo.phone + "</p>";
					if (vInfo.url) {
						fsqAttribution = '<br /><a href="' + vInfo.url + '" target="blank">' + fsqAttribution + '</a>';
					}
					if (vInfo.error) {
						info = '<br/><span style="text-align:center;">Sorry, there was an error retrieving information.<br / >Please try again later.</span><br /><br />';
					}
				}
				this.infowindow.setContent(info + fsqAttribution);
			},
			/**
			* @description Private function AJAX call to get Foursquare data
			* @param {string} venueId - Foursquare venue ID passed to request
			*/
			_getFoursquare: function(venueId) {
				var self = this;
				var url = 'https://api.foursquare.com/v2/venues/' + venueId + '?client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET + '&v=20160103';
				var venueData = {
						error: false
					};
				// clear stale infowindow data
				self._setInfoWindow();
				var request = $.getJSON(url, null, function(data) {
					venueData.name = data.response.venue.name;
					venueData.phone = data.response.venue.contact.formattedPhone;
					venueData.phone = venueData.phone ? venueData.phone : "None"
					venueData.url = data.response.venue.canonicalUrl;
				}, "json")
				.fail(function(data) {
				    venueData.error = true;
				})
				.always(function() {
					self._setInfoWindow(venueData);
				});
			}
		};
		return Mapper;
	})();
	window.Mapper = Mapper;
})(window, Markerer);