(function(window, google, markerer) {

	// Mapper constructor
	var Mapper = (function() {
		function Mapper(el, opts) {
			this.googleMap = new google.maps.Map(el, opts);
			this.markers = new Markerer();
			// Google best practices call for only one info window to reduce clutter
			this.infowindow = new google.maps.InfoWindow();
		}
		Mapper.prototype = {
			// create a marker and add to the markers array
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
			// set marker visibility to newVal
			setVis: function(newVal, callback) {
				this.markers.find(callback, function(markers) {
					markers.forEach(function(marker) {
						marker.setVisible(newVal);
					});
				});
			},
			// bounce a marker for a short moment and show info window
			chooseMarker: function(callback) {
				var self = this;
				this.markers.find(callback, function(markers) {
					markers.forEach(function(marker){
						self._selectMarker(marker);
					});
				});
			},
			// close infowindow
			closeInfowindow: function() {
				this.infowindow.close();
			},
			// private function to bounce marker and set/show infowindow
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
				self._showInfoWindow(mkr);
			},
			// private bounce marker function
			_bounceMarker: function(mkr, time) {
				mkr.setAnimation(google.maps.Animation.BOUNCE);
					window.setTimeout(function(){
					mkr.setAnimation(null);
				}, time);
			},
			// private function to display info window
			_showInfoWindow: function(mkr){
				// set content of info window to the marker id (name)
				this.infowindow.open(this.googleMap, mkr);
			},
			// private function to set content in infowindow
			_setInfoWindow: function(vInfo){
				//initialize base infowindow information
				var info = '<br /><br /><br /><span style="text-align:center";>Loading Foursquare data...</span><br /><br /><br />';
				var fsqAttribution = '<img src="images/pb-foursquare.png">';
				if (vInfo){
					console.log(vInfo);
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
			// private function to get info window data from foursquare
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
				    console.log("error");
				    venueData.error = true;
				})
				.always(function() {
					self._setInfoWindow(venueData);
				    console.log("finished");
				});
			}
		};
		return Mapper;
	})();

	window.Mapper = Mapper;

})(window, google, Markerer);