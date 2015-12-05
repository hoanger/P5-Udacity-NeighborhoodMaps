(function(window, google) {

	// Mapper constructor
	var Mapper = function(el, opts) {
		this.googleMap = new google.maps.Map(el, opts);
	};
	Mapper.prototype = {
		addMarker: function(opts) {
			opts.map = this.googleMap;
			return new google.maps.Marker(opts);
		}
	};

	window.Mapper = Mapper;

})(window, window.google);