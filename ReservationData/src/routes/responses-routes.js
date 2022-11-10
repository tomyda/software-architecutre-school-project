const express = require("express");
const responsesController = require("../controllers/responses-controller");
const router = new express.Router();

router.post("/response", responsesController.sendResponse);

module.exports = router;
