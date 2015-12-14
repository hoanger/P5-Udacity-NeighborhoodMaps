(function(window) {

	// Marker list constructor
	var Markerer = (function() {
		function Markerer(params) {
			this.markers = [];
		}
		Markerer.prototype = {
			add: function(marker) {
				this.markers.push(marker);
			},
			find: function(marker) {

			},
			setVis: function(marker, vis) {
				marker.setVisible(vis);
			}
		};
		return Markerer;
	})();

	window.Markerer = Markerer;

})(window);