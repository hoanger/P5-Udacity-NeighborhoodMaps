(function(window, google) {

	// Mapper constructor
	var Mapper = function(el, opts) {
		this.googleMap = new google.maps.Map(el, opts);
	};
	Mapper.prototype = {

	};

	window.Mapper = Mapper;

})(window, window.google);