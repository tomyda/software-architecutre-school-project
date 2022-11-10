const express = require("express");
const handlers = require("./../handlers/handler");
const reservationValidationsController = require("../controllers/reservation_validations_controller");

const router = new express.Router();

router.get(
  "",
  handlers.authentication,
  reservationValidationsController.getValidations
);
router.post(
  "",
  handlers.authentication,
  reservationValidationsController.addValidations
);
router.delete(
  "",
  handlers.authentication,
  reservationValidationsController.deleteValidations
);

module.exports = router;
