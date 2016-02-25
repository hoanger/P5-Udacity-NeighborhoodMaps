(function(window) {
	var Markerer = (function() {
		/**
		* @description Object to hold list of markers and functions
		* @constructor
		*/
		function Markerer() {
			this.markers = [];
		}
		Markerer.prototype = {
			/**
			* @description Add a marker to list of markers
			* @param {object} marker - the marker to add to array
			*/
			add: function(marker) {
				this.markers.push(marker);
			},
			/**
			* @description Find all markers that match call back and call a function on them
			* @param {function} callback - a function that compares markers with parameters
			* @param {function} action - a callback to run on the found match
			* @returns an array of matched marker objects
			*/
			find: function(callback, action) {
				var callbackReturn;
	            var markers = this.markers;
	            var length = markers.length;
	            var matches = [];
	            // search markers for matches
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