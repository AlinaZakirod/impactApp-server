const express = require("express");
const router = express.Router();

const Act = require("../models/Act");
const Category = require("../models/Category");
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
  Act.findById(req.param.actId).then(theAction => {
    //we update not the Act itself, but the User who did the Act: Act changes score of the User and the completed and suggested acts
    User.findByIdAndUpdate(
      req.user._id,
      {
        score: req.body.value + req.body.currentScore,
        $push: { completedActs: theAction },
        $pull: { suggestedActs: theAction }
      },
      { new: true }
    )
      .then(updatedAct => res.json({ updatedAct }))
      .catch(err => console.log("Error while updating the act ", err));
    //{new: true} is added to have accurate change in Postman, without it {new: true} it will be one step behind
  }); // end Act.findById
});

//Read - display details of the act
router.post("/act/:actId", (req, res, next) => {
  Act.findById(req.params.actId)
    .then(theAct => res.json({ theAct }))
    .catch(err =>
      console.log("error while displaying the details of the act ", err)
    );
});

module.exports = router;
