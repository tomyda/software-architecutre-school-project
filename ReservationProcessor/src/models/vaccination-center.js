const mongoose = require("mongoose");
const validator = require("validator");

const vaccionationCenterSchema = new mongoose.Schema(
  {
    state: {
      type: Number,
      required: true,
      trim: true,
    },
    zone: {
      type: Number,
      required: true,
      trim: true,
    },
    center_code: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    working_hours: {
      type: Number,
      required: true,
      trim: true,
      validate(value) {
        if (value < 1 || value > 3) {
          throw new Error("Working hours must be between 1 and 3");
        }
      },
    },
    vaccination_data: {
      type: Array,
      default: [],
    },
  },
  { collection: "vaccinationCenters" }
);

const VaccinationCenterIn = mongoose.model(
  "vaccinationCenters",
  vaccionationCenterSchema
);

module.exports = {
  VaccinationCenterIn,
};
