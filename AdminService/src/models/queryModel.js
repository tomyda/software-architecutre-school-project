const mongoose = require("mongoose");
const uuid = require("uuid");
const validator = require("validator");
const config = require("../config/config");
const configStruct = config.getConfig();

const querySchema = new mongoose.Schema(
  {
    state: {
      type: Number,
      required: true,
      trim: true,
      validate(value) {
        if (value < 1 || value > configStruct.max_state_number) {
          throw new Error(
            "State code must be between 1 and " + configStruct.max_state_number
          );
        }
      },
    },
    zone: {
      type: Number,
      required: true,
      trim: true,
      validate(value) {
        if (value < 1 || value > configStruct.max_zone_number) {
          throw new Error(
            "Zone code must be between 1 and " + configStruct.max_zone_number
          );
        }
      },
    },
  },
  { collection: "reservations" }
);

const queryModel = mongoose.model("query", querySchema);

module.exports = {
  querySchema,
  queryModel,
};
