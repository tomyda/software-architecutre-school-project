const express = require("express");
const vaccinationQueriesController = require("../controllers/vaccination_query_controller");
const handlers = require("./../handlers/handler");

const router = new express.Router();

router.get(
  "/vaccinated-users",
  handlers.authentication,
  vaccinationQueriesController.getVaccinatedUsers
);

router.get(
  "/pending-vaccines",
  handlers.authentication,
  vaccinationQueriesController.getSortedPendingVaccines
);

module.exports = router;
