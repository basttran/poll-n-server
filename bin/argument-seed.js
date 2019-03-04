require("dotenv").config();
const mongoose = require("mongoose");
const Poll = require("../models/poll-model.js");
const Argument = require("../models/argument-model.js");
const sampleArguments = require("./sample-arguments.json");

mongoose
  .connect("mongodb://localhost/poll-n", {
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

Poll.find()
  .then(pollResults => {
    sampleArguments[0].inPolls = [pollResults[0]._id];
    sampleArguments[1].inPolls = [pollResults[0]._id];
    sampleArguments[2].inPolls = [pollResults[0]._id];

    sampleArguments[3].inPolls = [pollResults[1]._id];
    sampleArguments[4].inPolls = [pollResults[1]._id];
    sampleArguments[5].inPolls = [pollResults[1]._id];

    Argument.insertMany(sampleArguments)
      .then(insertResult => {
        console.log(`Inserted ${insertResult.length} arguments`);

        Poll.findByIdAndUpdate(pollResults[0]._id, {
          $push: {
            arguments: {
              $each: [
                insertResult[0]._id,
                insertResult[1]._id,
                insertResult[2]._id
              ]
            }
          }
        })
          .then(() => {
            console.log("Updated FIRST poll");
          })
          .catch(err => {
            console.log("Update FIRST Poll error", err);
          });

        Poll.findByIdAndUpdate(pollResults[1]._id, {
          $push: {
            arguments: {
              $each: [
                insertResult[3]._id,
                insertResult[4]._id,
                insertResult[5]._id
              ]
            }
          }
        })
          .then(() => {
            console.log("Updated SECOND poll");
          })
          .catch(err => {
            console.log("Update SECOND Poll error", err);
          });
      })
      .catch(err => {
        console.log("ARGUMENTS insert error", err);
      });
  })
  .catch(err => {
    console.log("POLL find error", err);
  });
