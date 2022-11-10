const reservationManagerService = require("../services/reservation-manager-service");

const cancelReservation = async (req, res) => {
  try {
    const result = await reservationManagerService.cancelReservation(req.body);
    res.status(200).json(result);
  } catch (error) {
    if (!error.status) {
      error.status = 500;
    }
    res.status(error.status).json(error);
  }
};

const getReservation = async (req, res) => {
  try {
    const result = await reservationManagerService.getReservation(req.query);
    res.status(200).json(result);
  } catch (error) {
    if (!error.status) {
      error.status = 500;
    }
    res.status(error.status).json(error);
  }
};

module.exports = {
  cancelReservation,
  getReservation,
};
