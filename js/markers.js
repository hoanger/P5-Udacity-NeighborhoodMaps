(function(window) {

	// Marker list constructor
	var Markerer = (function() {
		function Markerer(params) {
			this.markers = [];
		}
		Markerer.prototype = {
			// function to add marker to markers array
			add: function(marker) {
				this.markers.push(marker);
			},
			// function to find a marker
			find: function(callback, action) {
				var callbackReturn;
	            var markers = this.markers;
	            var length = markers.length;
	            var matches = [];
	            // search
		        for(i = 0; i < length; i++) {
		          callbackReturn = callback(markers[i]);
		          if (callbackReturn) {
		            matches.push(markers[i]);
		          }
		        }
		        //call the action on matches
		        if (action) {
		          action.call(this, matches);
		        }

		        return matches;
			}
		};
		return Markerer;
	})();

	window.Markerer = Markerer;

})(window);