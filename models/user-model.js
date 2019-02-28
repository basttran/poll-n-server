const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    // document structure & rules defined here
    username: { type: String, required: true, minlength: 3 },
    encryptedPassword: { type: String, required: true },
    encryptedEmail: {
      type: String,
      required: true,
      unique: true,
      match: /^.+@.+\..+$/
    },
    encryptedUsercode: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: ["normal", "admin"],
      default: "normal"
    },
    votedPolls: [{ type: ObjectId, ref: "VotePoll", required: true }],
    votedArgs: [{ type: ObjectId, ref: "VoteArg", required: true }]
  },
  {
    // additional settings for the Schema class defined here
    timestamps: true
  }
);

// "User" model -> "users" collection
const User = mongoose.model("User", userSchema);

module.exports = User;
