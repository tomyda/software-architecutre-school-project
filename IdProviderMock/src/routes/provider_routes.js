const express = require("express");
const providerController = require("../controllers/provider_controller");
const router = new express.Router();

router.get("/population", providerController.getCitizenInfo);

module.exports = router;
