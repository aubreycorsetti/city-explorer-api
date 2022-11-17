'use strict';

//console.log('our first server');

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
const axios = require('axios');

//USE
// Once we have required something, we have to use it
// Here is where we will assign the required file a variable
//React does this in one step with 'import' - express takes 2 steps(require and use)
//This is just how express works.
const app = express();

// We must tell express to use cors
app.use(cors());
// Define the PORT and validate that our .env file is working!
const PORT = process.env.PORT || 3002;

// If we see our server running on 3002, that means there's a problem with our .env file or how we are importing it!

//Routes
//This is where we will write handlers for our endpoints

//Create a basic default route
// app.get() correlates to axios.get()
// app.get() takes in a parament or a URL in quotes, and a callback function

app.get('/weather', async (request, response, next) => {
  try {

    let latInput = request.query.lat;
    let lonInput = request.query.lon;
    let url = `https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&lang=en&units=I&days=16&lat=${latInput}&lon=${lonInput}`;
   //console.log(url);
    let selectedCity = await axios.get(url);
    //console.log(selectedCity.data);
    let cityWeather = selectedCity.data.data.map(day => new Forecast(day));

    response.send(cityWeather);

  }
  catch (error) {
    next(error);
  }
});

app.get('/movie', async (request, response, next) => {
  console.log('hi');
  try {
    let searchMovie = request.query.search;
    let movieURL = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${searchMovie}`;
    let movieResults = await axios.get(movieURL);
    console.log(movieResults);
    let topMovies = movieResults.data.results.map(movie => new Movie(movie));

    response.send(topMovies);
  } catch (error) {
    next(error);
  }
});

// '*' wild card
// This will run for any route not defined above
app.get('*', (request, response) => {
  response.send('This is the landing page');
});


// ERRORS
// handle any errors
app.use((error, request, response) => {
  response.status(500).send(error.message);
});

// CLASSES

class Forecast {
  constructor(myCity) {
    //console.log('hi', myCity);
    //   this.date = myCity.date;
    this.date = myCity.valid_date;
    this.description = myCity.weather.description;
    this.low = myCity.low_temp;
    this.high = myCity.max_temp;
    this.fullDescription = `Low of ${this.low}, high of ${this.high} with ${this.description}.`;

  }
}

class Movie {
  constructor(movieObj) {
    this.title = movieObj.title;
    this.overview = movieObj.overview;
    this.avgRating = movieObj.vote_average;
    this.totalReviews = movieObj.vote_count;
    this.imgPath = movieObj.poster_path ? `https://image.tmdb.org/t/p/original/${movieObj.poster_path}` : ' ';
    this.releaseDate = movieObj.release_date;
  }
}

// LISTEN
// Start the server

// listen is an express method- it takes in a PORT value and a callback function!
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
