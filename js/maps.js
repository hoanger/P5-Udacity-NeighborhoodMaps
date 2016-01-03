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
					self._bounceMarker(marker, 700);
					self.infowindow.setContent(this.id);
					self.infowindow.open(self.googleMap, this);
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
			// bounce a marker for a short moment
			bounceMarker: function(callback) {
				var self = this;
				this.markers.find(callback, function(markers) {
					markers.forEach(function(marker){
						self._bounceMarker(marker, 1400);
					});
				});
			},
			// private bounce marker function
			_bounceMarker: function(mkr, time) {
				mkr.setAnimation(google.maps.Animation.BOUNCE);
					window.setTimeout(function(){
					mkr.setAnimation(null);
				}, time);
			}
		};
		return Mapper;
	})();

	window.Mapper = Mapper;

})(window, google, Markerer);