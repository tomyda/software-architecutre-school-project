const express = require("express");
const handlers = require("../handlers/handler");
const notificationsController = require("../controllers/notification_controller");

const router = new express.Router();

router.get(
  "",
  handlers.authentication,
  notificationsController.getNotificators
);
router.post(
  "/pending/:type",
  handlers.authentication,
  notificationsController.notifyPending
);
router.post(
  "/successful/:type",
  handlers.authentication,
  notificationsController.notifySuccessful
);
router.post(
  "/cancelation/:type",
  handlers.authentication,
  notificationsController.notifyCancelation
);

module.exports = router;
