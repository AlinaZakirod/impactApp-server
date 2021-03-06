const express = require("express");

const authRouter = express.Router();

const User = require("../models/User");
const Act = require("../models/Act");
const Category = require("../models/Category");

const bcrypt = require("bcryptjs");

const passport = require("passport");
const axios = require("axios");
const convert = require("xml-js");

authRouter.get("/community", (req, res, next) => {
  console.log("WHERE ARE MY USERS?!");
  User.find()
    .then(allUsers => res.json({ allUsers }))
    .catch(err => console.log("Error while displaying all users ", err));
});

// router.get("/acts", (req, res, next) => {
//   Act.find()
//     .then(allActs => res.json({ allActs }))
//     .catch(err => console.log("Error while displaying all acts ", err));
// });

authRouter.post("/profile/start", (req, res, next) => {
  console.log("INPUT FROM PROFILE", req.body.input_location);
  const query = req.body;

  let config = {
    auth: {
      app_id: "fe1b79e6",
      app_key: "7a47e4702a27b760f91378195e86012d"
    }
  };

  let url = process.env.API_COOLCLIMATE;
  url += "?op=get_defaults_and_results&input_size=";
  url += req.body.input_size;
  url += "&input_location=";
  url += req.body.input_location;
  url += "&input_location_mode=";
  url += req.body.input_location_mode;
  url += "&input_income=";
  url += req.body.input_income;

  axios
    .post(url, {}, config)
    .then(response => {
      let dataFromApi = response.data;
      let index = dataFromApi.indexOf("grand_total");
      let total = dataFromApi.substr(index + 12, 8);
      console.log("_______Search", total);
      res.json({ total });
    })
    .catch(err => {
      console.log("Error while getting response from Cool Climate API:", err);
    });
});

authRouter.post("/profile/household", (req, res, next) => {
  const query = req.body;
  console.log("HOUSEHOLD FROM PROFILE", req.body);
});

authRouter.post("/api/signup", (req, res, next) => {
  console.log("the user to sign up ", req.body);
  const { fullName, email, password } = req.body;

  if (fullName == "" || email == "" || password.match(/[0-9]/) === null) {
    // send JSON file to the frontend if any of these fields are empty or password doesn't contain a number
    res.status(401).json({
      message:
        "All fields need to be filled and password must contain a number! 🤨"
    });
    return;
  }

  User.findOne({ email })
    .then(foundUser => {
      if (foundUser !== null) {
        res.status(401).json({
          message: "A user with the same email is already registered!"
        });
        return;
      }

      const bcryptSalt = 10;
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const encryptedPassword = bcrypt.hashSync(password, salt);

      Act.find()
        // .populate("category")
        .then(allSuggestedActs => {
          // console.log("hellloooooooo: ", allSuggestedActs);
          const user = new User({
            fullName,
            email,
            encryptedPassword,
            score: 0,
            suggestedActs: []
          });
          allSuggestedActs.forEach(oneAct => {
            // console.log("one act -====== ", oneAct);
            user.suggestedActs.push(oneAct._id);
          });
          console.log("the new user ))))))) ", user);
          user
            .save()
            .then(updatedUserSuggestedActs => {
              User.findById(updatedUserSuggestedActs._id)
                .populate({
                  path: "suggestedActs",
                  populate: {
                    path: "category",
                    model: "Category"
                  }
                })
                .then(populatedUser =>
                  req.login(populatedUser, err => {
                    if (err) {
                      console.log(
                        "error when logging in after sign up *************** ",
                        err
                      );
                      // res.status(401).json({
                      //   message:
                      //     "Something happened when logging in after the signup"
                      // });
                      console.log("something before the return");

                      return;
                    }

                    // updatedUserSuggestedActs.encryptedPassword = undefined;
                    // console.log("something before that res status right there");
                    // res.status(200).json(updatedUserSuggestedActs);
                    // updatedUserSuggestedActs.suggestedActs.forEach(actId => {
                    //   Act.findById(actId)
                    //     .then(fullAct => {
                    //       console.log("fullAct: ", fullAct);
                    //     })
                    //     .catch(err => console.log("full act err"));
                    // });
                    // console.log(
                    //   "SUCCESS    =======     ",
                    //   updatedUserSuggestedActs
                    // );
                    res.json({ populatedUser });
                    return;
                  })
                )
                .catch();

              console.log("kdahkdhkahdkhakdhkahdk: ", updatedUserSuggestedActs);

              // res.status(200).json(updatedUserSuggestedActs);
              // console.log(">>>>>>>>> ", updatedUserSuggestedActs);

              // if all good, log in the user automatically
              // "req.login()" is a Passport method that calls "serializeUser()"
              // (that saves the USER ID in the session)
            })
            .catch(err => res.status(400).json(err));
        })
        .catch(
          err =>
            console.log(
              "error while creating array of suggested Acts in  User signup route ",
              err
            )
          // res.status(400).json(err)
        );
    })
    .catch(err => res.status(400).json(err)); // close User.findOne()
});

authRouter.post("/api/login", (req, res, next) => {
  passport.authenticate("local", (err, userDoc, failureDetails) => {
    if (err) {
      res.status(500).json({ message: "Something went wrong with login." });
    }
    if (!userDoc) {
      res.status(401).json(failureDetails);
    }

    req.login(userDoc, err => {
      if (err) {
        res.status(500).json({
          message: "Something went wrong with getting user object from DB"
        });
        return;
      }
      // set password to undefined so it doesn't get revealed in the client side (browser ==> react app)
      userDoc.encryptedPassword = undefined;
      // send json object with user information to the client
      res.status(200).json({ userDoc });
    });
  })(req, res, next);
});

authRouter.delete("/api/logout", (req, res, next) => {
  // "req.logout()" is a Passport method that removes the user ID from session
  req.logout();
  // send empty "userDoc" when you log out
  res.json({ userDoc: null });
  console.log(userDoc);
});

// check if user is logged in and if we are logged in what are user's details
// this is the information that is useful for the frontend application
authRouter.get("/api/checkuser", (req, res, next) => {
  console.log(">>>do i have user: ", req.user);
  if (req.user) {
    req.user.encryptedPassword = undefined;
    User.findById(req.user._id)
      .populate({
        path: "suggestedActs",
        populate: {
          path: "category",
          model: "Category"
        }
      })
      .then(userWithGatheredInfo => {
        console.log("New user in checkUser:", userWithGatheredInfo);
        res.status(200).json({ userDoc: userWithGatheredInfo });
        console.log("AFTER CHECKUSER:", userDoc);
      })
      .catch();
    // res.json(req.user)
  } else {
    res.status(401).json({ userDoc: null });
  }
});

module.exports = authRouter;
