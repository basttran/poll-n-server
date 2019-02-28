const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const voteArgumentSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    argument: { type: Schema.Types.ObjectId, ref: "Argument", required: true },
    poll: { type: Schema.Types.ObjectId, ref: "Poll", required: true },
    value: { type: Number, enum: [1, 2, 3, 4, 5] } // "stars" rating systeme like in Uber app
  },
  { timestamp: true }
);

const VoteArg = mongoose.model("VoteArg", voteArgumentSchema);

module.exports = VoteArg;
