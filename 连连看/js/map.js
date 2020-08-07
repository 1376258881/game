 var Map = function () {
 	this.data = [];
 }
 Map.prototype = {
 	put: function (key, value) {
 		this.data[key] = value;
 	},
 	get: function (key) {
 		return this.data[key];
 	},
 	remove: function (key) {
 		this.data[key] = null;
 	},
 	isEmpty: function () {
 		return this.data.length == 0;
 	},
 	size: function () {
 		return this.data.length;
 	}
 }