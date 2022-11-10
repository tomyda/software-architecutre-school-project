const mongoose = require("mongoose");
const uuid = require("uuid")
const validator = require("validator");
const config = require('../config/config')
const configStruct = config.getConfig()

const vaccionationCenterSchema = new mongoose.Schema(
  {
    state: {
      type: Number,
      required: true,
      trim: true,
      validate(value) {
        if (value < 1 || value > configStruct.max_state_number) {
          throw new Error("State code must be between 1 and " + configStruct.max_state_number);
        }
      }
    },
    zone: {
      type: Number,
      required: true,
      trim: true,
      validate(value) {
        if (value < 1 || value > configStruct.max_zone_number) {
          throw new Error("Zone code must be between 1 and " + configStruct.max_zone_number);
        }
      }
    },
    center_code: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (!uuid.validate(value)) {
          throw new Error("Invalid code. Must be a valid uuid");
        }
      }
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
        if (value < 0 || value > configStruct.max_hour_schedule) {
          throw new Error("Working hours must be between 0 and 2");
        }
      },
    },
  },
  { collection: "vaccinationCenters" }
)

const VaccinationCenter = mongoose.model(
  "vaccinationCenters",
  vaccionationCenterSchema
)

module.exports = {
  VaccinationCenter,
  vaccionationCenterSchema
}
