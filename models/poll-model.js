const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const pollSchema = new Schema(
  {
    title: { type: String, required: true, minlength: 3 },
    description: { type: String, required: true, minlength: 8, maxlength: 250 },
    votes: [{ type: Schema.Types.ObjectId, ref: "Vote" }]
  },
  { timestamp: true }
);

const Poll = mongoose.model("Poll", pollSchema);

module.exports = Poll;
