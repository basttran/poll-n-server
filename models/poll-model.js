const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const pollSchema = new Schema(
  {
    name: { type: String, required: true, minlength: 2 },
    subject: { type: String, required: true, minlength: 10 },
    image: { type: String, required: true, match: /^https?:\/\// },
    votes: { type: Array }
  },
  { timestamp: true }
);

const Poll = mongoose.model("Poll", pollSchema);

module.exports = Poll;
