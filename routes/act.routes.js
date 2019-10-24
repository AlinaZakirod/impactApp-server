const express = require("express");
const router = express.Router();

const Act = require("../models/Act");
// const Category = require("../models/Category");
const User = require("../models/User");

//Create Act route
router.post("/act/create", (req, res, next) => {
  // Category.find()
  // .then(allCategories => res.json({ allCategories }))
  // .catch(err => console.log('error while getting all Categories for Act ', err))

  console.log(req.body);

  Act.create({
    title: req.body.title,
    description: req.body.description,
    value: req.body.value,
    category: req.body.categoryid
  })
    .then(newAct => {
      res.json({ newAct });
    })
    .catch(err => console.log("Error while creating a new act", err));
});

//Read - display all acts
router.post("/acts", (req, res, next) => {
  Act.find()
    .then(allActs => res.json({ allActs }))
    .catch(err => console.log("Error while displaying all acts ", err));
});

// Delete Act route
router.post("/act/:actId/delete", (req, res, next) => {
  Act.findByIdAndDelete(req.params.actId)
    .then(() => console.log("Act deleted"))
    .catch(err => console.log("Error while deleting the act", err));
});

//Edit act route:
router.post("/act/:actId/update", (req, res, next) => {
  console.log(req.body);
  Act.findById(req.params.actId)
    .then(theAct => {
      console.log("-=-=-=-=-=-=-", theAct);
      //we update not the Act itself, but the User who did the Act: Act changes score of the User and the completed and suggested acts

      User.findByIdAndUpdate(
        req.user._id,
        {
          // score: (req.user.score = +req.body.value),
          score: Number(req.body.value) + Number(req.body.currentScore),

          $push: { completedActs: theAct._id },
          $pull: { suggestedActs: theAct._id }
        },
        { new: true }
      )
        .then(updatedUser => res.json({ updatedUser }))
        .catch(err => console.log("Error while updating the User ", err));
      //{new: true} is added to have accurate change in Postman, without it {new: true} it will be one step behind
    })
    .catch(err =>
      console.log("Error while submiting the Act as complete ", err)
    ); // end Act.findById
});

// router.post('/act/:actId/update', (req, res, next)=>{
//   Act.findById(req.params.actId)
//   .than()
//   .catch()
// })

//Read - display details of the act
router.post("/act/:actId", (req, res, next) => {
  Act.findById(req.params.actId)
    .then(theAct => res.json({ theAct }))
    .catch(err =>
      console.log("error while displaying the details of the act ", err)
    );
});

module.exports = router;
