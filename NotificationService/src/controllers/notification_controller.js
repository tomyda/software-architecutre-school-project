const notificationService = require("../services/notification_service");
const notificationErr = require("./../errors/notification_error");

const getNotificators = async (req, res) => {
  try {
    let notificators = await notificationService.getNotificators(req, res);
    res.status(200).json(notificators);
  } catch (error) {
    if (!error.status) {
      error.status = 500;
    }
    res.status(error.status).json(error);
  }
};

const notifyPending = async (req, res) => {
  try {
    await notificationService.notifyPending(req, res);
    return res
      .status(200)
      .json({
        message:
          "Successfully notified client via '" +
          notificatorType +
          "' of pending reservation.",
      });
  } catch (error) {
    if (!error.status) {
      error.status = 500;
    }
    return res.status(error.status).json(error);
  }
};

const notifySuccessful = async (req, res) => {
  try {
    await notificationService.notifySuccessful(req, res);
    return res
      .status(200)
      .json({
        message:
          "Successfully notified client via '" +
          notificatorType +
          "' of successful reservation.",
      });
  } catch (error) {
    if (!error.status) {
      error.status = 500;
    }
    return res.status(error.status).json(error);
  }
};

const notifyCancelation = async (req, res) => {
  try {
    await notificationService.nofifyCancelation(req, res);
    return res
      .status(200)
      .json({ message: "Successfully notified client  of cancelation." });
  } catch (error) {
    if (!error.status) {
      error.status = 500;
    }
    return res.status(error.status).json(error);
  }
};

module.exports = {
  getNotificators,
  notifyPending,
  notifySuccessful,
  notifyCancelation,
};
