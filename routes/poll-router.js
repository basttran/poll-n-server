const express = require("express");
const router = express.Router();
const User = require("../models/user-model.js");
const Poll = require("../models/poll-model.js");
const Vote = require("../models/vote-model.js");

// function specialErrorHandler(res, type, message) {
//   res.status(300).json({
//     errorType: type,
//     message: message
//   });
//   throw new Error();
// }

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

  Vote.find({ userId: { $eq: userId } })
    .populate("pollId")
    .then(voteArray => {
      let pollArray = voteArray
        .map(voteItem => voteItem.pollId)
        .sort((a, b) => {
          a.createdAt < b.createdAt;
        });
      res.json(pollArray);
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

  Vote.find({ userId: { $eq: userId } })
    .then(voteArray => {
      if (voteArray === "undefined") {
        console.log(
          "USER HAS NEVER VOTED BEFORE, SO WE'RE SENDING FIRST POLL ON THE STACK"
        );
        Poll.find()
          .sort({ createdAt: -1 })
          .then(pollArray => {
            res.json(pollArray[0]);
          })
          .catch(err => next(err));
      }

      let pollIdsAlreadyVoted = voteArray.map(voteItem =>
        voteItem.pollId.toString()
      );
      console.log(pollIdsAlreadyVoted);

      Poll.find()
        .sort({ createdAt: -1 })
        .then(pollArray => {
          let foundPoll = 0;
          let counter = 0;

          console.log("pollArray[counter]._id", pollArray[counter]._id);
          console.log(typeof pollArray[counter]._id);

          console.log("pollIdArray[0]", pollIdArray[0]);
          console.log(typeof pollIdsAlreadyVoted[0]);

          console.log(pollIdsAlreadyVoted.includes(pollArray[counter]._id));

          while (foundPoll === 0 && counter < pollArray.length) {
            if (
              !pollIdsAlreadyVoted.includes(pollArray[counter]._id.toString())
            ) {
              foundPoll = 1;
              res.json(pollArray[counter]);
            }
            counter++;
          }

          if (foundPoll === 0) {
            // specialErrorHandler(
            //   res,
            //   "noMoreAvailablePoll",
            //   "No more poll left unvoted at the moment."
            // );

            res.json("NO POLLS AVAILABLE");
          }
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));

  // // If user has never voted, then send most recenly created poll
  // User.findById(userId)
  //   .populate("votes")
  //   .then(userDoc => {
  //     if (!userDoc) {
  //       res.json("USER NOT FOUND IN DATABASE");
  //     }

  //     if (userDoc.votes === "undefined") {
  //       console.log(
  //         "USER HAS NEVER VOTED BEFORE, SO WE'RE SENDING FIRST POLL ON THE STACK"
  //       );
  //       Poll.find()
  //         .sort({ createdAt: -1 })
  //         .then(pollArray => {
  //           res.json(pollArray[0]);
  //         })
  //         .catch(err => next(err));
  //     }

  //     // Otherwise, extract list of already voted polls & send first poll that isn't in this array
  //     let voteArray = userDoc.votes;
  //     let pollIdArray = voteArray.map(voteItem => voteItem.pollId.toString());
  //     // console.log("POLL ID ARRAY", pollIdArray);
  //     Poll.find()
  //       .sort({ createdAt: -1 })
  //       .then(pollArray => {
  //         let foundPoll = 0;
  //         let counter = 0;

  //         while (foundPoll === 0 && counter < pollArray.length) {
  //           // console.log("pollArray[counter]._id", pollArray[counter]._id);
  //           // console.log(typeof pollArray[counter]._id);

  //           // console.log("pollIdArray[0]", pollIdArray[0]);
  //           // console.log(typeof pollIdArray[0]);

  //           // console.log(pollIdArray.includes(pollArray[counter]._id));

  //           if (!pollIdArray.includes(pollArray[counter]._id.toString())) {
  //             foundPoll = 1;
  //             res.json(pollArray[counter]);
  //           }
  //           counter++;
  //         }

  //         if (foundPoll === 0) {
  //           specialErrorHandler(
  //             res,
  //             "noMoreAvailablePoll",
  //             "No more poll left unvoted at the moment."
  //           );
  //         }
  //       })
  //       .catch(err => next(err));
  //   })
  //   .catch(err => next(err));
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

// Vote Poll
router.post("/vote-poll", (req, res, next) => {
  console.log("VOTE POLL", req.body);
  const { currentUser, pollItem, voteValue } = req.body;

  Vote.create({
    userId: currentUser._id,
    pollId: pollItem._id,
    value: voteValue
  })
    .then(voteDoc => {
      // console.log("vote-poll => VOTEDOC", voteDoc);

      User.findByIdAndUpdate(voteDoc.userId, { $push: { votes: voteDoc._id } })
        .then(userDoc => {
          // console.log("vote-poll => USERDOC", userDoc);

          Poll.findByIdAndUpdate(voteDoc.pollId, {
            $push: { votes: voteDoc._id }
          })
            .then(pollDoc => {
              // console.log("vote-poll => POLLDOC", pollDoc);
              res.json(pollDoc);
            })
            .catch(err => next(err));
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));
});

// Get Counts (Yes, No, Skip, etc.)
router.get("/get-count-yes", (req, res, next) => {
  const { pollId } = req.query;
  Vote.find({ pollId: { $eq: pollId }, value: { $eq: 1 } })
    .then(voteArray => res.json(voteArray.length))
    .catch(err => next(err));
});

module.exports = router;
