const mongoose = require("mongoose");
const uuid = require("uuid");
const validator = require("validator");

const givenVaccinesSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      min: 15,
      max: 100,
      validate(value) {
        if (!uuid.validate(value)) {
          throw new Error("Invalid uuid");
        }
      },
    },
    full_name: {
      type: String,
      required: true,
      min: 6,
      max: 255,
    },
    email: {
      type: String,
      required: true,
      min: 6,
      max: 255,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email");
        }
      },
    },
    password: {
      type: String,
      required: true,
      min: 6,
      max: 1024,
    },
    user_role: {
      type: String,
      required: true,
    },
    date_created: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "users" }
);

const User = mongoose.model("user", userSchema);

module.exports = {
  User,
};
