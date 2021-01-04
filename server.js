/* eslint-disable no-console */

require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const MOVIEARRAY = require('./movie-data.json');

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());

app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get('Authorization');

  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    return res.status(401).json({ error: 'Unauthorized request' });
  }
  next();
});

app.get('/movie', function handeleGetMovie(req, res) {
  const { genre, country, avg_vote } = req.query;
  let results = MOVIEARRAY;

  if (genre) {
    results = results.filter((movie) =>
      movie.genre.toLowerCase().includes(genre.toLowerCase())
    );
  } 

  if (country) {
    results = results.filter((movie) => 
      movie.country.toLowerCase().includes(country.toLowerCase())
    );
  }

  if (avg_vote) {
    results = results.filter((movie) =>
      Number(movie.avg_vote) >= Number(avg_vote)
    );
  }

  res.json(results);
});

const PORT = 8080;

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});