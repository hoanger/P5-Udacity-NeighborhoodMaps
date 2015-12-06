(function(window, google) {

	// Mapper constructor
	var Mapper = (function() {
		function Mapper(el, opts) {
			this.googleMap = new google.maps.Map(el, opts);
		};
		Mapper.prototype = {
			addMarker: function(opts) {
				opts.map = this.googleMap;
				return new google.maps.Marker(opts);
			},
			setMarkerVis: function(marker, visible) {
				marker.setVisible(visible);
			}
		};
		return Mapper;
	})();

	window.Mapper = Mapper;

})(window, google);