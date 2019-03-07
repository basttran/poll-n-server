const express = require("express");
const router = express.Router();
const User = require("../models/user-model.js");
const Poll = require("../models/poll-model.js");

// Popular Polls
router.get("/polls", (req, res, next) => {
  Poll.find()
    .sort({ createdAt: -1 })
    .then(pollFindResults => res.json(pollFindResults))
    .catch(err => next(err));
});

// Polls Created By User
router.get("/polls-created", (req, res, next) => {
  const { userId } = req.query;

  Poll.find({ createdBy: { $eq: userId } })
    .sort({ createdAt: -1 })
    .then(pollFindResults => res.json(pollFindResults))
    .catch(err => next(err));
});

// Polls Voted By User
router.get("/polls-voted", (req, res, next) => {
  const { userId } = req.query;

  User.findById(userId)

    .then(userDoc => {
      let resultArray = [];

      userDoc.votes.forEach(vote => {
        Poll.findbyId(vote.pollId)
          .then(poll => resultArray.push(poll))
          .catch(err => next(err));
      });

      res.json(resultArray);
    })

    .catch(err => next(err));
});

// Poll Details
router.get("/polls/:pollId", (req, res, next) => {
  const { pollId } = req.params;
  Poll.findById(pollId)
    .then(pollDoc => res.json(pollDoc))
    .catch(err => next(err));
});

// Next Poll
router.get("/next-poll", (req, res, next) => {
  const { userId } = req.query;
  console.log("USERID", userId);

  // If user has never voted, then send most recenly created poll
  User.findById(userId)
    .then(userDoc => {
      if (!userDoc) {
        res.json("RIEN TROUVE");
      }

      if (userDoc.votes === "undefined") {
        Poll.find()
          .sort({ createdAt: -1 })
          .then(pollArray => {
            res.json(pollArray[0]);
          })
          .catch(err => next(err));
      }

      // Otherwise, extract list of already voted polls & send first poll that isn't in this array
      const voteArray = userDoc.votes;
      const pollIds = voteArray.map(voteItem => voteItem.pollId);
      Poll.find()
        .sort({ createdAt: -1 })
        .then(pollArray => {
          pollArray.forEach(pollItem => {
            if (!pollIds.includes(pollItem._id)) {
              res.json(pollItem);
            }
          });
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));
});

// Add Poll
router.post("/polls", (req, res, next) => {
  console.log(req.body);
  const { title, description, currentUser } = req.body;
  const votes = [];
  Poll.create({ title, description, votes, createdBy: currentUser._id })
    .then(pollDoc => res.json(pollDoc))
    .catch(err => next(err));
});

module.exports = router;
