'use strict';

console.log('our first server');

// REQUIRE
// In our servers, we have to use 'require' instead of import
// Here we will list the requirements for our server
const express = require('express');
let data = require('./data/weather.json');


// We need to bring in our .env file so we will use this after we have installed
// 'npm i dotenv'
require('dotenv').config();

// We must include cors if we want to share resources over the web

const cors = require('cors');
const { response } = require('express');

//USE
// Once we have required something, we have to use it
// Here is where we will assign the required file a variable
//React does this in one step with 'import' - express takes 2 steps(require and use)
//This is just how express works.
const app = express();

// We must tell express to use cors
app.use(cors())
;
// Define the PORT and validate that our .env file is working!
const PORT = process.env.PORT || 3002;

// If we see our server running on 3002, that means there's a problem with our .env file or how we are importing it!

//Routes
//This is where we will write handlers for our endpoints

//Create a basic default route
// app.get() correlates to axios.get()
// app.get() takes in a parament or a URL in quotes, and a callback function

app.get('/weather', (request, response, next) => {
  try {
    // /weather?city=value
    let cityInput = request.query.city;
    let selectedCity = data.find(cityData => cityData.city_name.toLowerCase === cityInput.toLowerCase);
    let cityWeather = selectedCity.data.map(day => new Forecast(day));
    console.log('here', cityWeather);
    //let cityCleanUp = new City(selectedCity);

    response.send(cityWeather);
  }
  catch (error) {
    next(error);
  }
});

console.log(data);

// '*' wild card
// This will run for any route not defined above
app.get('*', (request, response) => {
  response.send('This is the landing page');
});


// ERRORS
// handle any errors
app.use((error, request, response, next) => {
  response.status(500).send(error.message);
});

// CLASSES

class Forecast {
  constructor(myCity) {
    //console.log('hi', myCity);
    //   this.date = myCity.date;
    this.date = myCity.valid_date;
    this.description = myCity.weather.description;
  }
}

// LISTEN
// Start the server

// listen is an express method- it takes in a PORT value and a callback function!
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
