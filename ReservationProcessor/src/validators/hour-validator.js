const AbstractValidator = require("./abstract-validator");
const reservationError = require("../errors/reservation_error")

class HourValidator extends AbstractValidator {
  constructor() {
    super();
    this.name = "hour-validator";
    this.description = "Valides the hour of the reservation is 1, 2 or 3";
    this.atEnd = false;
  }

  Validate() {
    return (reservation) => {
      if (reservation.Schedule > 3 || reservation.Schedule < 1 || reservation.Schedule == "" || reservation.Schedule == "null" || isNaN(reservation.Schedule)) {
        throw new reservationError.InvalidReservationReceived("The hour must be 1, 2 or 3 ")
      }
    }
      
  }
}

module.exports = HourValidator;
