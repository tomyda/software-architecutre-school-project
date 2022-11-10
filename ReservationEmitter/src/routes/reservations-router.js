const express = require("express");
const reservationManagerController = require("../controllers/reservation-manager-controller");
const router = new express.Router();

router.delete("/reservations", reservationManagerController.cancelReservation);

router.get("/reservations", reservationManagerController.getReservation);

module.exports = router;
