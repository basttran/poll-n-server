const express = require("express");

const Argument = require("../models/argument-model.js");

const router = express.Router();

// Browse arguments
router.get("/polls/:pollId/add-argument", (req, res, next) => {
  Argument.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .then(argumentFindResults => res.json(argumentFindResults))
    .catch(err => next(err));
});

// Argument Detail
router.get("/arguments/:argumentId", (req, res, next) => {
  const { argumentId } = req.params;
  Argument.findById(argumentId)
    .then(argumentDoc => res.json(argumentDoc))
    .catch(err => next(err));
});

// Add Argument
router.post("/arguments", (req, res, next) => {
  const { shortText, longText, ref } = req.body;
  Argument.create({ shortText, longText, ref })
    .then(argumentDoc => res.json(argumentDoc))
    .catch(err => next(err));
});

module.exports = router;
