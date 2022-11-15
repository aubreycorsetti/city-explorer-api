'use strict';

console.log('our first server');

// REQUIRE
// In our servers, we have to use 'require' instead of import
// Here we will list the requirements for our server
const express = require('express');
let data = require('./data/pets.json');

// We need to bring in our .env file so we will use this after we have installed
// 'npm i dotenv'
require('dotenv').config();

//USE
// Once we have required something, we have to use it
// Here is where we will assign the required file a variable
//React does this in one step with 'import' - express takes 2 steps(require and use)
//This is just how express works.
const app = express();

// Define the PORT and validate that our .env file is working!
const PORT = process.env.PORT || 3002;

// If we see our server running on 3002, that means there's a problem with our .env file or how we are importing it!

//Routes
//This is where we will write handlers for our endpoints

//Create a basic default route
// app.get() correlates to axios.get()
// app.get() takes in a parament or a URL in quotes, and a callback function
app.get('/', (request, response) => {
  response.send('Hello, from our server');
});

app.get('/sayHello', (request, response) => {
  console.log(request.query);
  let lastName = request.query.lastName
  response.send(`hi ${request.query.name}${lastName}`);
});

// '*' wild card
// This will run for any route not defined above
app.get('*', (request, response) => {
  response.send('That route does not exist');
});

app.get('/pet', (request, response) => {
  let species = request.query.species;
  let selectedWeather = data.find(weather => weather.species === species);
  let newPrediction = new Weather(selectedWeather);
  response.send(newPrediction);
});

// ERRORS
// handle any errors

// CLASSES

class Weather {
  constructior(weatherObj){
    this.name = weatherObj.name;
    this.breed = weatherObj.breed;
  }
}

// LISTEN
// Start the server

// listen is an express method- it takes in a PORT value and a callback function!
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
