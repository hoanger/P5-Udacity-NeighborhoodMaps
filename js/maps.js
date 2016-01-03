(function(window, google, markerer) {

	// Mapper constructor
	var Mapper = (function() {
		function Mapper(el, opts) {
			this.googleMap = new google.maps.Map(el, opts);
			this.markers = new Markerer();
			// Google best practices call for only one info window to reduce clutter
			this.infowindow = new google.maps.InfoWindow({
    			content: ''
  			});
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
					marker.setAnimation(google.maps.Animation.BOUNCE);
					window.setTimeout(function(){
						marker.setAnimation(null);
					}, 700);
					self.infowindow.setContent(marker.id);
					self.infowindow.open(self.googleMap, marker);
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
				this.markers.find(callback, function(markers) {
					markers.forEach(function(marker){
						marker.setAnimation(google.maps.Animation.BOUNCE);
						window.setTimeout(function(){
							marker.setAnimation(null);
						}, 1400);
					});
				});
			}
		};
		return Mapper;
	})();

	window.Mapper = Mapper;

})(window, google, Markerer);