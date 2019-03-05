const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const voteSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    pollId: { type: Schema.Types.ObjectId, ref: "Poll", required: true },
    value: { type: Number, enum: [0, 1, 2] } // 0 = No, 1 = Yes, 2 = Skip
  },
  { timestamp: true }
);

const Vote = mongoose.model("Vote", votePollSchema);

module.exports = Vote;
