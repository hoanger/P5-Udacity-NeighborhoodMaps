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
					// ajax request for Foursquare data
					var jqxhr = self._getFoursquare(this.fsqid);
					// var venueData = jqxhr.responseJSON.response.venue;
					console.log(jqxhr);

					self._bounceMarker(marker, 700);
					self._showInfoWindow(marker);
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
						self._bounceMarker(marker, 1400);
						self._showInfoWindow(marker);
					});
				});
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
				this.infowindow.setContent(mkr.id);
				this.infowindow.open(this.googleMap, mkr);
			},
			// private function to get info window data from foursquare
			_getFoursquare: function(venueId) {
				if (venueId) {
					var url = 'https://api.foursquare.com/v2/venues/' + venueId + '?client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET + '&v=20160103';
					var request =	$.get( url, function(data) {
						alert( "success" );
						console.log(data.response);
						var venueData = {}
						venueData = data;

					})
					.fail(function(data) {
					    alert( "error" );

					})
					.always(function() {
					    alert( "finished" );
					});
				} else {
					console.log("No information available")
					var venueData = "No Info";
				}
				return venueData;
			}
		};
		return Mapper;
	})();

	window.Mapper = Mapper;

})(window, google, Markerer);