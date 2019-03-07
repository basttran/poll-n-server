const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user-model.js");
const isSocialSecurity = require("../lib/is-social-security.js");
const router = express.Router();

function specialErrorHandler(res, type, message) {
  res.status(400).json({
    errorType: type,
    message: message
  });
  throw new Error();
}

router.post("/process-signup", (req, res, next) => {
  const {
    username,
    originalPassword,
    originalEmail,
    originalUsercode,
    tags
  } = req.body;

  const tagArray = tags.split(" ");
  const role = "normal";

  // check if username already exists in DB
  User.findOne({ username: { $eq: username } })
    .then(userDoc => {
      if (userDoc) {
        specialErrorHandler(res, "usernameExists", "Username already exists.");
      }

      // check if usercode already exists by searching the database
      return User.find();
    })
    .then(userArray => {
      userArray.forEach(userDoc => {
        if (bcrypt.compareSync(originalUsercode, userDoc.encryptedUsercode)) {
          specialErrorHandler(
            res,
            "usercodeExists",
            "Social Security Number already registered."
          );
        }
      });

      // enforce password rules (can't be empty and MUST have a digit)
      if (!originalPassword || !originalPassword.match(/[0-9]/)) {
        specialErrorHandler(
          res,
          "passwordNotValid",
          "Password can't be blank and must contain a number."
        );
      }

      // enforce usercode rules (*** french social security number, also called "NIR", see above for guidelines ***)
      if (originalUsercode && !isSocialSecurity(originalUsercode)) {
        specialErrorHandler(
          res,
          "usercodeNotValid",
          "Social Security Number is invalid."
        );
      } else if (originalUsercode && isSocialSecurity(originalUsercode)) {
        role = "certified";
      }

      // encrypt the user's usercode, password and email too before saving it
      const encryptedUsercode = bcrypt.hashSync(originalUsercode, 10);
      const encryptedPassword = bcrypt.hashSync(originalPassword, 10);
      const encryptedEmail = bcrypt.hashSync(originalEmail, 10);

      return User.create({
        username,
        encryptedPassword,
        encryptedEmail,
        encryptedUsercode,
        tags: tagArray,
        role,
        votes: []
      });
    })
    .then(userDoc => {
      // log in  the user automaticaly when they create their account
      req.logIn(userDoc, () => {
        // hide encryptedPassword, encryptedEmail & encryptedUsercode before sending JSON (it's a security risk)
        userDoc.encryptedPassword = undefined;
        userDoc.encryptedEmail = undefined;
        userDoc.encryptedUsercode = undefined;
        res.json(userDoc);
      });
    })
    .catch(err => next(err));
});

router.post("/process-login", (req, res, next) => {
  const { username, originalPassword } = req.body;

  // validate the username by searching the database for an account with that email
  User.findOne({ username: { $eq: username } })
    .then(userDoc => {
      if (!userDoc) {
        next(new Error("Email is incorrect."));
        return;
      }

      const { encryptedPassword } = userDoc;
      if (!bcrypt.compareSync(originalPassword, encryptedPassword)) {
        next(new Error("Password is incorrect."));
        return;
      }

      req.logIn(userDoc, () => {
        userDoc.encryptedPassword = undefined;
        userDoc.encryptedEmail = undefined;
        userDoc.encryptedUsercode = undefined;
        res.json(userDoc);
      });
    })
    .catch(err => next(err));
});

router.get("/logout", (req, res, next) => {
  // req.logOut() is a Passport method that removes the USER ID from the session
  req.logOut();
  res.json({ message: "You are logged out!" });
});

module.exports = router;
