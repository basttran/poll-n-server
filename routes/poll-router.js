const express = require("express");

const Poll = require("../models/poll-model.js");

const router = express.Router();

// Browse Polls
router.get("/polls", (req, res, next) => {
  Poll.find()
    .sort({ createdAt: -1 })
    .then(pollFindResults => res.json(pollFindResults))
    .catch(err => next(err));
});

// Poll Details
router.get("/polls/:pollId", (req, res, next) => {
  const { pollId } = req.params;
  Poll.findById(pollId)
    .populate("arguments")
    .then(pollDoc => res.json(pollDoc))
    .catch(err => next(err));
});

// Add Poll
router.post("/polls", (req, res, next) => {
  console.log(req.body);
  const { shortText, longText, image } = req.body;
  Poll.create({ shortText, longText, image })
    .then(pollDoc => res.json(pollDoc))
    .catch(err => next(err));
});

//

module.exports = router;
