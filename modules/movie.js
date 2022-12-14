'use strict';

let cache = require('./cache');
const axios = require('axios');
require('dotenv').config();


async function getMovie(request, response) {
  console.log('MOVIES!!!!!!!!');
  let city = request.query.search;
  const key = 'movie-' + city;
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${city}`;



  if (cache[key] && (Date.now() - cache[key].timestamp < 50000)) {
    console.log('Cache hit');
  } else {
    console.log('Cache miss');
    cache[key] = {};
    cache[key].timestamp = Date.now();
    cache[key].data = await axios.get(url)
      .then(response => parseMovie(response.data));
  }

  response.send(cache[key].data);
}

function parseMovie(movieData) {
  console.log(movieData);
  try {
    const myMovie = movieData.results.map(day => {
      return new Movie(day);
    });
    return Promise.resolve(myMovie);
  } catch (e) {
    return Promise.reject(e);
  }
}

class Movie {
  constructor(movieObj) {
    this.title = movieObj.title;
    this.overview = movieObj.overview;
    this.avgRating = movieObj.vote_average;
    this.totalReviews = movieObj.vote_count;
    this.imgPath = movieObj.poster_path ? `https://image.tmdb.org/t/p/original/${movieObj.poster_path}` : '';
    this.releaseDate = movieObj.release_date;
  }
}

module.exports = getMovie;
