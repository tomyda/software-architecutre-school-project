const mongoose = require("mongoose");

const validationSchema = new mongoose.Schema(
  { name: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      required: true,
      trim: true
    },
    atEnd: {
      type: Boolean,
      trim: true
    },
  },
  { collection: "validations" }
)

const validationSchemaIn = mongoose.model(
  "validation",
  validationSchema
)
  
module.exports = {
  validationSchemaIn,
  validationSchema
}