(function() {

	"use strict";

		app.factory("getWeatherFactory", function($http) {

			function getWeather() {
				return $http.get('data/weather.json');
			}

			// -> We return the object
			return {
				getWeather: getWeather
			}

		});

})();