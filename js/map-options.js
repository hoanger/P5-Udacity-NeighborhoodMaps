(function(window, google, mapper) {
	mapper.MAP_OPTIONS = {
		center: {
			lat: 49.2375057,
			lng: -123.1354528
		},
		scrollwheel: false,
		zoom: 11,
		minZoom: 10,
		maxZoom: 15,
		mapTypeControl: false,
		streetViewControl: false,
		zoomControlOptions: {
			position: google.maps.ControlPosition.LEFT_TOP
		}
	};

})(window, google, window.Mapper || (window.Mapper = {}));