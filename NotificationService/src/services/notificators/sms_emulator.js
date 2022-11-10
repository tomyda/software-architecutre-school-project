const notificationErr = require("./../../errors/notification_error");

const notifyPending = async (req) => {
  validatePendingNotification(req.body);
  printPendingNotification(req.body);
};

const notifySuccessful = async (req) => {
  validateSuccessfulNotification(req.body);
  printSuccessfulNotification(req.body);
};

const nofifyCancelation = async (req) => {
  console.log(
    "Reservation " +
      req.body.reservation_code +
      " for document " +
      req.body.document +
      " was cancelled successfully."
  );
};

const validateSuccessfulNotification = (notification) => {
  if (!notification.date) {
    throw new notificationErr.NotificationError("no date received");
  }
  if (!notification.reservation_code) {
    throw new notificationErr.NotificationError("no reservation_code received");
  }
  if (!notification.cellphone) {
    throw new notificationErr.NotificationError("no cellphone received");
  }
  if (!notification.document) {
    throw new notificationErr.NotificationError("no document received");
  }
  if (!notification.state) {
    throw new notificationErr.NotificationError("no state received");
  }
  if (!notification.zone) {
    throw new notificationErr.NotificationError("no zone received");
  }
  if (!notification.vaccination_center_code) {
    throw new notificationErr.NotificationError("no center_code received");
  }
  if (!notification.quota_code) {
    throw new notificationErr.NotificationError("no quota_code received");
  }
};

const validatePendingNotification = (notification) => {
  if (!notification.reservation_code) {
    throw new notificationErr.NotificationError("no reservation_code received");
  }
};

const printPendingNotification = (notification) => {
  console.log(
    "\nSMS EMULATOR: Sent to: " +
      notification.cellphone +
      " Reservation added to Waiting List! When new quota available, you will be booked." +
      "\nReservation code: " +
      notification.reservation_code +
      ".\nLatency: " +
      notification.latency +
      " ==> Initial: " +
      notification.timestamp_sent +
      " Response: " +
      notification.timestamp_awnser +
      "."
  );
};

const printSuccessfulNotification = (notification) => {
  console.log(
    "\nSMS EMULATOR:  Sent to: " +
      notification.cellphone +
      " Successfully booked reservation!" +
      "\nReservation code: " +
      notification.reservation_code +
      ".\nDocument ID: " +
      notification.document +
      ".\nDate: " +
      notification.date +
      '.\nLocation: State "' +
      notification.state +
      ", Zone " +
      notification.zone +
      ", Center Code " +
      notification.center_code +
      ".\nLatency: " +
      notification.latency +
      " ==> Initial: " +
      notification.timestamp_sent +
      " Response: " +
      notification.timestamp_awnser +
      "."
  );
};

module.exports = {
  notifyPending,
  notifySuccessful,
  nofifyCancelation,
};
