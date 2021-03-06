const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      minlength: 2
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^.+@.+\..+$/
    },
    score: {
      type: Number
    },
    completedActs: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Act"
        }
      ]
    },
    suggestedActs: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Act"
        }
      ]
    },
    encryptedPassword: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

// "User" model --> "users" collection
const User = mongoose.model("User", userSchema);
module.exports = User;

// module.exports = mongoose.model("User", userSchema);;
