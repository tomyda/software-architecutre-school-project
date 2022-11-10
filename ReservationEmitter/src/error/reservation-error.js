class ReservationsError extends Error {
  constructor(message, status) {
    super();

    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;

    this.message = message || "Something went wrong. Please try again.";

    this.status = status || 500;
  }
}

class InvalidReservationReceived extends ReservationsError {
  constructor(message) {
    super(message || "Unable to cancel reservation.", 400);
  }
}

class InvalidReservationForConsult extends ReservationsError {
  constructor(message) {
    super(message || "Unable to find reservation.", 400);
  }
}

module.exports = {
  ReservationsError,
  InvalidReservationReceived,
  InvalidReservationForConsult,
};
