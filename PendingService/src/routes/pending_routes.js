const express = require("express");
//const pendingController = require('./../controllers/pending_controller')
const router = new express.Router();

router.post("/health", (req, res) => {
  console.log("Pending Functioning");
});

module.exports = router;
