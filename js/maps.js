(function(window, google, markerer) {

	// Mapper constructor
	var Mapper = (function() {
		function Mapper(el, opts) {
			this.googleMap = new google.maps.Map(el, opts);
			this.markers = new Markerer();
		}
		Mapper.prototype = {

			// create a marker and add to the markers array
			addMarker: function(opts) {
				var marker;
				opts.map = this.googleMap;
				marker = new google.maps.Marker(opts);
				this.markers.add(marker);
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
							marker.setAnimation(null)
						}, 1400);
					});
				});
			}
		};
		return Mapper;
	})();

	window.Mapper = Mapper;

})(window, google, Markerer);