const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const votePollSchema = new Schema(
  {
    user: { type: ObjectId, ref: "User", required: true },
    poll: { type: ObjectId, ref: "Poll", required: true },
    value: { type: Number, enum: [0, 1, 2] } // 0: 'no' or 'against', 1: 'yes' or 'in favor', 2: 'no opinion' or 'mixed opinion'
  },
  { timestamp: true }
);

const VotePoll = mongoose.model("VotePoll", votePollSchema);

module.exports = VotePoll;
