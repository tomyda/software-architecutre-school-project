const AbstractValidator = require("./abstract-validator");
const reservationError = require("../errors/reservation_error")

class StateValidator extends AbstractValidator {
  constructor() {
    super();
    this.name = "state-validator";
    this.description = "Valides the state is between 1 and 19";
    this.atEnd = false;
  }

  Validate() {
        return (reservation) => {
          if (reservation.State > 19 || reservation.State < 1 || reservation.State == "null" || reservation.State == "" || isNaN(reservation.State) ) {
            throw new reservationError.InvalidReservationReceived("Invalid State with document: " + reservation.DocumentId)
          }
        }
       
  }
}

module.exports = StateValidator;
