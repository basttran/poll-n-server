const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const pollSchema = new Schema(
  {
    title: { type: String, required: true, minlength: 2 },
    description: { type: String, required: true, minlength: 3, maxlength: 250 },
    votes: [{ type: Schema.Types.ObjectId, ref: "Vote" }],
    createdBy: { type: Schema.Types.ObjectId, ref: "User" }
  },
  { timestamp: true }
);

const Poll = mongoose.model("Poll", pollSchema);

module.exports = Poll;
