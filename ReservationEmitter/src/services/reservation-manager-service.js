const Reservation = require("../models/reservation");
const reservationErrors = require("../error/reservation-error");
const config = require("./../config/config");
const configStruct = config.getConfig();
const fetch = require("node-fetch");

const cancelReservation = async (reservationToCancel, res) => {
  var responseCount;
  var error;

  const result = await Reservation.ReservationIn.deleteOne({
    document: reservationToCancel.document,
    reservation_code: reservationToCancel.reservation_code,
  })
    .then((data) => {
      responseCount = data.deletedCount;
    })
    .catch((err) => {
      error = err;
    });

  if (error) {
    throw new reservationErrors.InvalidReservationReceived(
      "Invalid reservation."
    );
  }

  var message;

  if (responseCount == 1) {
    message =
      "Reservation " +
      reservationToCancel.reservation_code +
      " for document " +
      reservationToCancel.document +
      " was cancelled successfully.";

    let token = await getTokenFromAuthService();

    fetch(
      configStruct.notification_service.notify_success_address +
        "/" +
        configStruct.notification_service.notification_type,
      {
        method: "POST",
        body: JSON.stringify(reservationToCancel),
        headers: { "Content-Type": "application/json", "auth-token": token },
      }
    )
      .then((result) => result.json())
      .then(
        (json) => console.log(json)
        //logger.info("Notification was correctly sent to user with document: " + reservation.DocumentId, __filename.split("src")[1])
      )
      .catch(
        (err) => console.log("Notification Error: " + err)
        //logger.error("Error when sending notification to user with document: " + reservation.DocumentId + ". Error: " + err.message, __filename.split("src")[1])
      );
  } else {
    throw new reservationErrors.InvalidReservationReceived(
      "Reservation could not be cancelled as the document " +
        reservationToCancel.document +
        " or the reservation code " +
        reservationToCancel.reservation_code +
        "is incorrect."
    );
  }

  return { message: message };
};

const getReservation = async (params) => {
  var reservation;
  var error;
  const result = await Reservation.ReservationIn.findOne({
    document: params.document,
  })
    .then((data) => {
      reservation = data;
    })
    .catch((err) => {
      error = err;
    });

  if (error) {
    throw new reservationErrors.InvalidReservationReceived(
      "Invalid reservation."
    );
  }

  var message;
  if (reservation) {
    message =
      "Successfully booked reservation!" +
      " Reservation code: " +
      reservation.reservation_code +
      ". Document ID: " +
      reservation.document +
      ". Location: State " +
      reservation.state +
      ", Zone " +
      reservation.zone +
      ", Center Code " +
      reservation.vaccination_center_code +
      ". Latency: " +
      reservation.latency +
      " ==> Initial: " +
      reservation.timestamp_sent +
      " Response: " +
      reservation.timestamp_awnser +
      ".";
    return { message: message };
  } else {
    throw new reservationErrors.InvalidReservationForConsult(
      "Unable to find reservation"
    );
  }
};

const getTokenFromAuthService = async () => {
  var resultAsJson;
  var error;
  await fetch(configStruct.auth_service.service_token, {
    method: "POST",
    body: JSON.stringify({ user_id: "processor_service" }),
    headers: { "Content-Type": "application/json" },
  })
    .then((data) => data.json())
    .then((json) => {
      resultAsJson = json;
    })
    .catch((err) => {
      error = err;
    });

  if (error) {
    // TODO: LOG ERROR
    let err = new reservationErrors.ReservationsError(
      "Error generating token for service",
      500
    );
    process.exit(1);
  }
  if (resultAsJson.status && resultAsJson.status != 200) {
    process.exit(1);
  }

  return resultAsJson.access_token;
};

module.exports = {
  cancelReservation,
  getReservation,
};
