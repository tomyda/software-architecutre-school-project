const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    document: {
      type: Number,
      required: true,
      trim: true,
    },
    cellphone: {
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
    vaccination_center_code: {
      type: String,
      required: true,
      trim: true,
    },
    reservation_code: {
      type: String,
      required: true,
      trim: true,
      default: "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          var r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        }
      ),
    },
    date: {
      type: String,
      required: true,
      trim: true,
    },
    hour: {
      type: Number,
      required: true,
      trim: true,
    },
    timestamp_sent: {
      type: Date,
      required: true,
      trim: true,
    },
    timestamp_awnser: {
      type: Date,
      trim: true,
    },
    timestamp_difference: {
      type: Date,
      trim: true,
    },
  },
  { collection: "reservations" }
);

const ReservationIn = mongoose.model("reservations", reservationSchema);

module.exports = {
  ReservationIn,
};
