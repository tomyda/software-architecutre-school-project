const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    documentID: {
      type: Number,
      required: true,
      trim: true,
    },
    cellphone: {
      type: Number,
      required: true,
      trim: true,
    },
    reservationDate: {
      type: Date,
      required: true,
      trim: true,
    },
    schedule: {
      type: Number,
      required: true,
      trim: true,
    },
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
    birthDate: {
      type: Date,
      required: true,
      trim: true,
    },
    timestamp_sent: {
      type: String,
      trim: true,
    },
  },
  { collection: "reservations" }
);

const ReservationIn = mongoose.model("Reservation", reservationSchema);

module.exports = {
  ReservationIn,
};
