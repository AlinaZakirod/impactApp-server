const express = require("express");

const router = express.Router();

const Category = require("../models/Category");

router.get("/category/new", (req, res, next) => {
  Category.find()
    .then(allCategories => req.body({ allCategories }))
    .catch(err => console.log("Error while creating a new plan", err));
});

router.post("/category/create", (req, res, next) => {
  let newTitle = req.body.title;
  let newDescription = req.body.description;

  Category.create({
    title: newTitle,
    description: newDescription,
    actions: []
  })
    .then(newCategory => {
      res.json({ newCategory });
    })
    .catch(err => console.log("error while creating a new category", err));
});

// R display all categories in the home page
// router.get("/", (req, res, next) => {
//   Category.find()
//     .then(categoriesFromDb => console.log({categoriesFromDb}))
//     .catch(err => console.log("Error displaying all categories", err));
// });

module.exports = router;
