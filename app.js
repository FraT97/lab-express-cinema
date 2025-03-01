const express = require("express");
const hbs = require("hbs");
const mongoose = require("mongoose");
const Movie = require("./models/movie.model");

require("dotenv/config");

const app = express();
app.set("views", __dirname + "/views");
app.set("view engine", "hbs");

// Connect to MongoDB
const MONGO_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/lab-express-cinema";

mongoose
  .connect(MONGO_URI)
  .then((x) => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);
  })
  .catch((err) => {
    console.error("Error connecting to mongo: ", err);
  });


// Home route
app.get("/", (req, res) => {
  res.render("index"); // Home page
});

app.get('/movies', (req, res) => {
    res.render( 'movies'); 
})

// Movies list route

app.get("/movies", async (req, res) => {
    try {
      const movies = await Movie.find(); // Fetch all movies from the database
      res.render("movies", { movies }); // Pass movies to the template
    } catch (error) {
      console.error("Error fetching movies:", error);
      res.status(500).send("Error loading movies");
    }
  });

// Movie details route
app.get("/movieDetails/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    res.render("movieDetails", { movie });
  } catch (error) {
    console.error("Error fetching movie details:", error);
  }
});

// Error handling
app.use((req, res) => {
  res.status(404).send("Page Not Found");
});

module.exports = app;
