const fetch = require("node-fetch");
const http = require("http");

const Reservation = require("../models/reservation-data");
const dataErr = require("../errors/data_error");
const config = require("./../config/config");
const configStruct = config.getConfig();

const getAndBookReservations = async (offset, limit) => {
  const filter = {};
  const projection = null;
  const options = { skip: offset, limit: limit };

  for await (const reservation of Reservation.ReservationIn.find(
    filter,
    projection,
    options
  ).cursor()) {
    try {
      reservation.timestamp_sent = new Date(); //TODO: no se esta poniendo la fecha bien
      sendReservationData(JSON.stringify(reservation));
    } catch (error) {
      throw dataErr.UnableToBookReservationErr(reservation);
    }
  }
};

const sendReservationData = async (reservation) => {
  try {
    const result = await fetch(configStruct.processor_service.register, {
      method: "post",
      body: reservation,
      setTimeout: 300000,
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((json) => console.log(json));
  } catch (error) {
    console.log(
      "Unable to book reservation: " + reservation + "\nError: " + error
    );
  }
};

module.exports = {
  getAndBookReservations,
};
