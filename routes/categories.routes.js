const express = require("express");

const router = express.Router();
const User = require("../models/User");
const Category = require("../models/Category");

// router.post("/category/new", (req, res, next) => {
//   console.log(req.body);
// });

router.post("/category/create", (req, res, next) => {
  // let newTitle = req.body.title;
  // let newDescription = req.body.description;
  const { title, description, author } = req.body;
  Category.create({
    // title: req.body.title,
    // description: req.body.description,
    // author: req.body.currentUser,
    title,
    description,
    author,
    actions: []
  })
    .then(newCategory => {
      res.json({ newCategory });
    })
    .catch(err => console.log("error while creating a new category", err));
});

// Read 1  display all categories in the home page
router.get("/category/allCats", (req, res, next) => {
  Category.find()
    .then(allCategories => res.json({ allCategories }))
    .catch(err => console.log("Error displaying all categories", err));
});

//Delete category route:
router.post("/category/:theId/delete", (req, res, next) => {
  Category.findByIdAndDelete(req.params.theId)
    .then(() => {
      res.json({ response: "Deleted" });
    })
    .catch(err => console.log("error while delteing the category: ", err));
});

//Edit  category route:
router.post("/category/:theId/update", (req, res, next) => {
  Category.findByIdAndUpdate(req.params.theId, req.body)
    .then(updatedCategory => console.log({ updatedCategory }))
    .catch(err => console.log("Error while updating category ", err));
});

// Read 2 display details of a particular category
router.post("/category/:theId", (req, res, next) => {
  Category.findById(req.params.theId)
    .then(theCategory => {
      res.json({ theCategory });
    })
    .catch();
});

module.exports = router;
