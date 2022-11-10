const mongoose = require("mongoose");

const configurationSchema = new mongoose.Schema(
  { endpoint: {
      type: String,
      required: true,
      trim: true
    },
    service: {
      type: String,
      required: true,
      trim: true
    },
  },
  { collection: "configurations" }
)

const configurationSchemaIn = mongoose.model(
  "configuration",
  configurationSchema
)
  
module.exports = {
    configurationSchemaIn,
  configurationSchema
}