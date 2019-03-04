const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const argumentSchema = new Schema(
  {
    shortText: { type: String, required: true, minlength: 5 },
    longText: { type: String, required: true, minlength: 10, maxlength: 250 },
    ref: [{ type: String, match: /^https?:\/\// }],
    inPolls: [{ type: Schema.Types.ObjectId, ref: "Polls" }],
    voteArgs: [{ type: Schema.Types.ObjectId, ref: "VoteArg" }]
  },
  { timestamp: true }
);

const Argument = mongoose.model("Argument", argumentSchema);

module.exports = Argument;
