require("dotenv").config();
const mongoose = require("mongoose");
const Poll = require("../models/poll-model.js");
const samplePolls = require("./sample-polls.json");

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true
  })
  .then(x => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch(err => {
    console.error("Error connecting to mongo", err);
  });

Poll.insertMany(samplePolls)
  .then(insertResult => {
    console.log(`Inserted ${insertResult.length} polls`);
  })
  .catch(err => {
    console.log("POLLS insert error", err);
  });
