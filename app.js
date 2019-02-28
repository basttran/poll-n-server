require("dotenv").config();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const mongoose = require("mongoose");
const logger = require("morgan");
const path = require("path");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const passport = require("passport");

mongoose
  .connect("mongodb://localhost/poll-n", { useNewUrlParser: true })
  .then(x => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch(err => {
    console.error("Error connecting to mongo", err);
  });

const app = express();

// Middleware Setup
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Allow Cross-Origin
// (allow access to the API from other domains/origins)
app.use(
  cors({
    // receive cookies from other domains/origins
    credentials: true,
    // only these domains/origins can access the API
    origin: ["http://localhost:3000"]
  })
);

app.use(
  session({
    // set these default settings to avoid warnings
    resave: true,
    saveUninitialized: true,
    // session secret must be different for every app
    secret: process.env.SESSION_SECRET,
    // save session information inside our MongoDB
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Routes
const poll = require("./routes/poll-router.js");
// all routes in the phone router will start with "/api"
app.use("/api", poll);

const auth = require("./routes/auth-router.js");
app.use("/api", auth);

module.exports = app;
