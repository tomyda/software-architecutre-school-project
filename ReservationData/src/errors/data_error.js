class DataError extends Error {
  constructor(message, status) {
    super();

    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;

    this.message = message || "Something went wrong and caused a data error.";

    this.status = status || 500;
  }
}

class ServiceErr extends DataError {
  constructor(message) {
    super(message || "An internal error occurred", 500);
  }
}

class UnableToBookReservationErr extends DataError {
  constructor(reservation) {
    super(
      "Error attempting to book following reservation:\n" + reservation,
      500
    );
  }
}

module.exports = {
  ServiceErr,
  UnableToBookReservationErr,
};
