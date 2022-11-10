const reservationService = require("../services/reservation-service");
const dataErr = require("./../errors/data_error");

const getReservations = async (req, res) => {
  try {
    await reservationService.getAndBookReservations(0, 10000);
  } catch (error) {
    if (!error.status) {
      error = new dataErr.ServiceErr();
    }
    console.log(error);
  }
  console.log("All Requests Sent");
};

module.exports = {
  getReservations,
};
