const express = require("express");
const handlers = require("./../handlers/handler");
const router = new express.Router();

const vaccinatedUserController = require("../controllers/vaccinated_user_controller");

router.post(
  "",
  handlers.authentication,
  vaccinatedUserController.addVaccinatedUser
);

module.exports = router;
