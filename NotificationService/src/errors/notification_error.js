class NotificationError extends Error {
  constructor(message, status) {
    super();

    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;

    this.message =
      message || "Something went wrong and caused a notification error.";

    this.status = status || 500;
  }
}

class InvalidTokenError extends NotificationError {
  constructor(message) {
    super(message || "The provided token is invalid", 401);
  }
}

class InvalidUserInControlError extends NotificationError {
  constructor(cause) {
    super("Invalid User in Control Error: " + cause, 403);
  }
}

class InvalidNotificationError extends NotificationError {
  constructor(cause) {
    super("Invalid Notification Receied: " + cause, 400);
  }
}

class InvalidNotificatorType extends NotificationError {
  constructor(type) {
    super("Invalid Notificator Type (unknown): " + type, 400);
  }
}

module.exports = {
  NotificationError,
  InvalidTokenError,
  InvalidUserInControlError,
  InvalidNotificationError,
  InvalidNotificatorType,
};
