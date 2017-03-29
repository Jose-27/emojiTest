(function() {

	"use strict";
	
	app.controller("mainCtrl", function($scope,$http,getWeatherFactory){

		// -> just incase to prevent scope chain
		var self = $scope;

		// -> here we are handaling the promise return by our factory
		getWeatherFactory.getWeather().then(function(weather){

			var _results = weather.data.query.results.channel;

			self.weather = {
				city: _results.location.city,
				region: _results.location.region,
				condition: _results.item.condition.text,
				temp: _results.item.condition.temp,
				highOfTheDay: _results.item.forecast[0].high,
				lowOfTheDay: _results.item.forecast[0].low,
				humidity: _results.atmosphere.humidity,
				pressure: _results.atmosphere.pressure,
				windSpeed:_results.wind.speed,
				sunrise:  _results.astronomy.sunrise,
				sunset:   _results.astronomy.sunset,
				forecast: _results.item.forecast
			};
		});


	});

})();