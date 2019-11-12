const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const actSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  value: {
    type: Number
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category"
  }
});

const Act = mongoose.model("Act", actSchema);
module.exports = Act;
