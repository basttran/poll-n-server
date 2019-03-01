const express = require("express");

const Poll = require("../models/poll-model.js");

const router = express.Router();

// Browse polls
router.get("/polls", (req, res, next) => {
  Poll.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .then(pollFindResults => res.json(pollFindResults))
    .catch(err => next(err));
});

// Poll Detail
router.get("/polls/:pollId", (req, res, next) => {
  const { pollId } = req.params;
  Poll.findById(pollId)
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

module.exports = router;
