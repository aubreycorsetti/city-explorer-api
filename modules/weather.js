'use strict';

let cache = require('./cache');
const axios = require('axios');


async function getWeather(request, response) {
  let lat = request.query.lat;
  let lon = request.query.lon;
  const key = 'weather-' + lat + lon;
  const url = `https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&lang=en&units=I&days=16&lat=${lat}&lon=${lon}`;



  if (cache[key] && (Date.now() - cache[key].timestamp < 50000)) {
    console.log('Cache hit');
  } else {
    console.log('Cache miss');
    cache[key] = {};
    cache[key].timestamp = Date.now();
    cache[key].data = await axios.get(url)
      .then(response => parseWeather(response.data));
  }

  response.send(cache[key].data);
}

function parseWeather(weatherData) {
  try {
    const cityWeather = weatherData.data.map(day => {
      return new Forecast(day);
    });
    return Promise.resolve(cityWeather);
  } catch (e) {
    return Promise.reject(e);
  }
}

class Forecast {
  constructor(myCity) {
    this.date = myCity.valid_date;
    this.description = myCity.weather.description;
    this.low = myCity.low_temp;
    this.high = myCity.max_temp;
    this.fullDescription = `Low of ${this.low}, high of ${this.high} with ${this.description}.`;
  }
}

module.exports = getWeather;
