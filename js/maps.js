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
			setVis: function(newVal, callback) {
				this.markers.find(callback, function(markers) {
					markers.forEach(function(marker) {
						marker.setVisible(newVal);
					});
				});
			}
		};
		return Mapper;
	})();

	window.Mapper = Mapper;

})(window, google, Markerer);