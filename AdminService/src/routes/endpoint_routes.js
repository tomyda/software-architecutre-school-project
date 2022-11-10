const express = require("express");
const router = new express.Router();
const endpointsController = require("../controllers/endpointsController");

router.post("", endpointsController.addEndpoint);
router.get("", endpointsController.getEndpoint);
router.delete("", endpointsController.deleteEndpoint);

module.exports = router;
