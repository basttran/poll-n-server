const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const pollSchema = new Schema(
  {
    shortText: { type: String, required: true, minlength: 8 },
    longText: { type: String, required: true, minlength: 12, maxlength: 250 },
    image: { type: String, match: /^https?:\/\// },
    votePolls: [{ type: ObjectId, ref: "VotePoll" }],
    arguments: [{ type: ObjectId, ref: "Argument" }]
  },
  { timestamp: true }
);

const Poll = mongoose.model("Poll", pollSchema);

module.exports = Poll;
