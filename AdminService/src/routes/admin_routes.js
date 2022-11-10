const express = require("express");
const handlers = require("./../handlers/handler");
const router = new express.Router();
const adminController = require("../controllers/admin_controller");

// Register
router.post("", handlers.authentication, adminController.registerAdmin);
router.post(
  "/vaccinator",
  handlers.authentication,
  adminController.registerVaccinator
);

// Session
router.post("/session", adminController.logIn);
router.delete("/session", handlers.authentication, adminController.logOut);

module.exports = router;
