'use strict';

const express = require('express');
let theWeather = require('./modules/weather');
let theMovie = require('./modules/movie');

require('dotenv').config();

const cors = require('cors');

const app = express();


app.use(cors());

const PORT = process.env.PORT || 3002;


app.get('/weather', theWeather);

app.get('/movie', theMovie);


app.get('*', (request, response) => {
  response.send('This is the landing page');
});



app.use((error, request, response) => {
  response.status(500).send(error.message);
});


app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
