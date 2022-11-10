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
    super(message || "Unable to store reservations.", 400);
  }
}

class TimeForReservationExpired extends ReservationsError {
  constructor(message) {
    super(
      message || "The time for processing the reservation was over 5 minutes.",
      500
    );
  }
}

class FilterPipelineNotInitialized extends ReservationsError {
  constructor() {
    super("The filter pipeline is not initialized", 500);
  }
}

module.exports = {
  ReservationsError,
  InvalidReservationReceived,
  FilterPipelineNotInitialized,
  TimeForReservationExpired,
};
