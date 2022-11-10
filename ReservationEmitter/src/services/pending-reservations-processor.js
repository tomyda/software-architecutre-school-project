const mongoose = require("mongoose");
const Logger = require("../../logger/src/logger");
const config = require("./../config/config");
const ReservationIn = require("../models/reservation");

const configStruct = config.getConfig();
const logger = new Logger();
const algorithms = require("./algorithms/" +
  configStruct.app.algorithm_implementation);

class PendingReservationsProcessorService {
  constructor() {}

  async processReservation(reservation) {
    // logger.info("pending reservations arrived" + reservation);

    reservation = algorithms.pendingTransformations(reservation);

    let insertedErr = await mongoose.connection
      .collection(configStruct.mongo.reservations)
      .insertOne(reservation)
      .then((result) => {
        logger.info(
          "pending reservation " +
            reservation +
            " was added to database successfully."
        );
        return null;
      })
      .catch((err) => {
        return adminErr.ErrorAddingNewQuota("database error " + err);
      });
    if (insertedErr) {
      throw insertedErr;
    }

    // var newReservation = new ReservationIn.ReservationIn(reservation);
    // newReservation.save(function (err) {
    //   if (err) {
    //     console.log("Error saving pending reservation " + err);
    //     console.log("Reservation should be sent to retry queue");
    //     return;
    //   }
    //   console.log(
    //     "Reservation saved to pending reservations database successfully"
    //   );
    // });
  }
}

module.exports = PendingReservationsProcessorService;
