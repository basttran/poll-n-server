const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const argumentSchema = new Schema(
  {
    shortText: { type: String, required: true, minlength: 5 },
    longText: { type: String, required: true, minlength: 10, maxlength: 250 },
    ref: [{ type: String, match: /^https?:\/\// }],
    inPolls: [{ type: ObjectId, ref: "Polls", required: true }],
    voteArgs: [{ type: ObjectId, ref: "VoteArg", required: true }]
  },
  { timestamp: true }
);

const Argument = mongoose.model("Argument", argumentSchema);

module.exports = Argument;
