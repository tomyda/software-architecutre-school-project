const fs = require("fs");
const fetch = require("node-fetch");
const notificationErr = require("./../errors/notification_error");
const config = require("./../config/config");
const configStruct = config.getConfig();

const getNotificators = async (req, res) => {
  if (
    req.user_in_control.auth_client_id != "superadmin" &&
    req.user_in_control.auth_client_id != "admin"
  ) {
    throw new notificationErr.InvalidUserInControlError(
      "user in control not from this service"
    );
  }

  try {
    result = await fs.readdirSync("./src/services/notificators");
  } catch (error) {
    throw new notificationErr.NotificationError(
      "Error retrieving notificators: internal error while reading all notificators",
      500
    );
  }

  var notificators = [];
  result.forEach((fileName) => {
    let splitted = fileName.split(".");
    notificators.push(splitted[0]);
  });

  return notificators;
};

const notifyPending = async (req, res) => {
  if (
    req.user_in_control.auth_client_id != "superadmin" &&
    req.user_in_control.auth_client_id != "admin" &&
    req.user_in_control.auth_client_id != "service"
  ) {
    throw new notificationErr.InvalidUserInControlError(
      "user in control not does not have necessary privileges"
    );
  }

  var notificator;
  notificatorType = req.params.type;
  try {
    notificator = await require("./../services/notificators/" +
      notificatorType);
  } catch (error) {
    throw new notificationErr.InvalidNotificatorType(notificatorType);
  }
  await notificator.notifyPending(req);
};

const nofifyCancelation = async (req, res) => {
  if (
    req.user_in_control.auth_client_id != "superadmin" &&
    req.user_in_control.auth_client_id != "admin" &&
    req.user_in_control.auth_client_id != "service"
  ) {
    throw new notificationErr.InvalidUserInControlError(
      "user in control not does not have necessary privileges"
    );
  }

  var notificator;
  notificatorType = req.params.type;
  try {
    notificator = await require("./../services/notificators/" +
      notificatorType);
  } catch (error) {
    throw new notificationErr.InvalidNotificatorType(notificatorType);
  }
  await notificator.nofifyCancelation(req);
};

const notifySuccessful = async (req, res) => {
  if (
    req.user_in_control.auth_client_id != "superadmin" &&
    req.user_in_control.auth_client_id != "admin" &&
    req.user_in_control.auth_client_id != "service"
  ) {
    throw new notificationErr.InvalidUserInControlError(
      "user in control not does not have necessary privileges"
    );
  }

  var notificator;
  notificatorType = req.params.type;
  try {
    notificator = await require("./../services/notificators/" +
      notificatorType);
  } catch (error) {
    throw new notificationErr.InvalidNotificatorType(notificatorType);
  }
  await notificator.notifySuccessful(req);
};

module.exports = {
  getNotificators,
  notifyPending,
  notifySuccessful,
  nofifyCancelation,
};
