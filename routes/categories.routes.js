const express = require("express");

const router = express.Router();

const Category = require("../models/Category");

// router.post("/category/new", (req, res, next) => {
//   console.log(req.body);
// });

router.post("/category/create", (req, res, next) => {
  // let newTitle = req.body.title;
  // let newDescription = req.body.description;

  Category.create({
    title: req.body.title,
    description: req.body.description,
    actions: []
  })
    .then(newCategory => {
      res.json({ newCategory });
    })
    .catch(err => console.log("error while creating a new category", err));
});

// Read 1  display all categories in the home page
router.post("/", (req, res, next) => {
  Category.find()
    .then(allCategories => res.json({ allCategories }))
    .catch(err => console.log("Error displaying all categories", err));
});

// Read 2 display details of a particular category
router.post("/category/:theId", (req, res, next) => {
  Category.findById(req.params.theId);
});

//Delete category route:
router.post("/category/:theId/delete", (req, res, next) => {
  Category.findByIdAndDelete(req.params.theId)
    .then(() => console.log("deleted"))
    .catch(err => console.log("error while delteing the category: ", err));
});

module.exports = router;
