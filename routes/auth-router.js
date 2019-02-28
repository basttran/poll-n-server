const express = require("express");
const bcrypt = require("bcrypt");

const User = require("../models/user-model.js");

const router = express.Router();

router.post("/process-signup", (req, res, next) => {
  const {
    username,
    originalPassword,
    originalEmail,
    originalUsercode
  } = req.body;

  // enforce password rules (can't be empty and MUST have a digit)
  if (!originalPassword || !originalPassword.match(/[0-9]/)) {
    // this is like next(err) but we are creating our own error object
    next(new Error("Password can't be blank and must contain a number."));

    // use return to stop the function here if the password is incorrect
    return;
  }

  //   function valideNir($nir){

  //     /*
  //      * ####################################################################################################################
  //      * Par GV le 21 / 01 / 2014. Dans la REGEX, chaque ligne représente un groupe de règles ci-dessous.
  //      * ####################################################################################################################
  //      * Position 1 : 1 pour un homme, 2 pour une femme, 3 pour les personnes étrangères en cours d’immatriculation,
  //      * 7 et 8 pour les numéros provisoires
  //      * ####################################################################################################################
  //      * Position 2 et 3 : Les deux derniers chiffres de l'année de naissance, de 00 à 99
  //      * ####################################################################################################################
  //      * Position 4 et 5 : Mois de naissance, de 01 (janvier) à 12 (décembre), de 20 à 30 et de 50 à 99 pour les
  //      * personnes dont la pièce d'état civil ne précise pas le mois de naissance, de 31 à 42 pour celle dont la pièce
  //      * d'état civile est incomplète mais précise quand même le mois de naissance
  //      * ####################################################################################################################
  //      * Position 6 à 10 : Trois cas de figures
  //      * CAS 1 :
  //      * Position 6 et 7 : Département de naissance métropolitain, de 01 à 95 (plus 2A ou 2B pour la Corse)
  //      * Dans des cas exceptionnels, il est possible de trouver le numéro 96 qui correspondait à la Tunisie avant 1956.
  //      * Position 8, 9 et 10 : Numéro d'ordre de naissance dans le département, de 001 à 989 ou 990
  //      * CAS 2 :
  //      * Position 6, 7 et 8 : Département de naissance Outre-mer, de 970 à 989
  //      * Position 9 et 10 : Numéro d'ordre de naissance dans le département, de 01 à 89, ou 90
  //      * CAS 3 :
  //      * Position 6 et 7 : Naissance hors de France, une seule valeur : 99
  //      * Position 8, 9 et 10 : Identifiant du pays de naissance, de 001 à 989, ou 990
  //      * ####################################################################################################################
  //      * Position 11, 12 et 13 : Numéro d'ordre de l'acte de naissance dans le mois et la commune (ou pays) de 001 à 999
  //      * ####################################################################################################################
  //      * Position 14 et 15 : Clé de contrôle, de 01 à 97 (Non contrôlé dans ce cas)
  //      * ####################################################################################################################
  //      */
  //     $regexp = '/^
  //     ([1-37-8])
  //     ([0-9]{2})
  //     (0[0-9]|[2-35-9][0-9]|[14][0-2])
  //     ((0[1-9]|[1-8][0-9]|9[0-69]|2[abAB])(00[1-9]|0[1-9][0-9]|[1-8][0-9]{2}|9[0-8][0-9]|990)|(9[78][0-9])(0[1-9]|[1-8][0-9]|90))
  //     (00[1-9]|0[1-9][0-9]|[1-9][0-9]{2})
  //     (0[1-9]|[1-8][0-9]|9[0-7])
  //     $/x';

  //     return preg_match($regexp, $nir) > 0;

  // }

  // // enforce password rules (can't be empty and MUST have a digit)
  // if (!originalUsercode || !originalUsercode.match(/[0-9]/)) {
  //   // this is like next(err) but we are creating our own error object
  //   next(new Error("Password can't be blank and must contain a number."));

  //   // use return to stop the function here if the password is incorrect
  //   return;
  // }

  // encrypt the user's password before saving it
  const encryptedPassword = bcrypt.hashSync(originalPassword, 10);

  // encrypt the user's email before saving it
  const encryptedEmail = bcrypt.hashSync(originalEmail, 10);

  // encrypt the user's email before saving it
  const encryptedUsercode = bcrypt.hashSync(originalUsercode, 10);

  User.create({
    username,
    encryptedPassword,
    encryptedEmail,
    encryptedUsercode
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

  // validate the email by searching the database for an account with that email
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

  req.json({ message: "You are logged out!" });
});

module.exports = router;
