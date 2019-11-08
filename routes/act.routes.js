const express = require("express");
const router = express.Router();

const Act = require("../models/Act");
// const Category = require("../models/Category");
const User = require("../models/User");

//Create Act route
router.post("/act/create", (req, res, next) => {
  console.log("------ this is create route", req.body);
  const { title, description, value, category } = req.body;
  Act.create({
    title,
    description,
    value,
    author,
    category
  })
    // allCategories
    // .forEach(oneCat => {
    //   category.push(oneCat._id);
    // })
    .then(newAct => {
      console.log("we are creating action");

      User.updateMany({ $push: { suggestedActs: newAct._id } })
        .then(() => res.json({ newAct }))
        .catch();
      // update all the users ti push this action in the suggested action array
    })
    .catch(err => console.log("Error while creating the Act", err));
});
//   Category.find()
//     .then(allCategories => {
//     .catch(err => console.log("Error while getting Categories for Acts ", err));
// });

//Read - display all acts
router.get("/acts", (req, res, next) => {
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

// {_id: ObjectId('5dae55bb13a9ec0110202649')}

//Edit act route:
router.post("/act/:actId/update", (req, res, next) => {
  console.log("YEAH THIS ----------- ", req.params.actId);
  // console.log(res.json);
  Act.findById(req.params.actId)

    .then(theAct => {
      console.log("the session ******    *******     *****  ", req.session);
      console.log("-=-=-=-=-=-=-", theAct, "**********", req.user);
      //we update not the Act itself, but the User who did the Act: Act changes score of the User and the completed and suggested acts

      User.findByIdAndUpdate(
        req.user._id,
        {
          $push: { completedActs: theAct.id },
          $pull: { suggestedActs: theAct._id },
          score: req.user.score + theAct.value
        },
        { new: true }
      )
        .then(updatedUser => {
          console.log("++++++++++++++++++++++++++++++ ", updatedUser);

          res.json({ updatedUser });
        })
        .catch(err => console.log("Error while updating the User ", err));
      //{new: true} is added to have accurate change in Postman, without it {new: true} it will be one step behind
    })
    .catch(err =>
      console.log("Error while submiting the Act as complete ", err)
    );
});

// end Act.findById

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
