const express = require("express");
const handlers = require("./../handlers/handler");
const router = new express.Router();

const vaccinationCenterController = require("../controllers/vaccination_center_controller");

router.post(
  "",
  handlers.authentication,
  vaccinationCenterController.addVaccinationCenter
);

router.put(
  "/:center_code/quota",
  handlers.authentication,
  vaccinationCenterController.updateVaccinationCenterQuota
);

module.exports = router;
