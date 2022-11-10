const reservationService = require("../services/reservation_service");
const client = require("../index");

const sendReservation = async (req, res) => {
  try {
    // It does not return, as it returns inside the function
    const result = await reservationService.sendReservation(req, req.body, res);
    return res.status(200).json(result);
  } catch (error) {
    if (!error.status) {
      error.status = 500;
    }
    return res.status(error.status).json(error);
  }
};

module.exports = {
  sendReservation,
};
