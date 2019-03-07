const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: { type: String, required: true, minlength: 3 },
    encryptedPassword: { type: String, required: true },
    encryptedEmail: {
      type: String,
      unique: true
    },
    encryptedUsercode: { type: String },
    role: {
      type: String,
      required: true,
      enum: ["normal", "certified", "admin"],
      default: "normal"
    },
    votes: [{ type: Schema.Types.ObjectId, ref: "Vote" }],
    tags: []
  },
  {
    timestamps: true
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
