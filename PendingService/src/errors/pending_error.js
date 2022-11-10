class PendingError extends Error {
  constructor(message, status) {
    super();

    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;

    this.message =
      message || "Something went wrong and caused a pending error.";

    this.status = status || 500;
  }
}

class InternalPendingErr extends PendingError {
  constructor(message) {
    super(message || "Internal error occurred", 500);
  }
}

module.exports = {
  PendingError,
  InternalPendingErr,
};
