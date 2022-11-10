const AbstractValidator = require("./abstract-validator");
const reservationError = require("../errors/reservation_error")

class ZoneValidator extends AbstractValidator {
  constructor() {
    super();
    this.name = "zone-validator";
    this.description = "Valides the zone is between 1 and 99";
    this.atEnd = false;
  }

  Validate() {
    return (reservation) => {
      if (reservation.Zone > 99 || reservation.Zone < 1 || reservation.Zone == "null" || reservation.Zone == "" || isNaN(reservation.Zone)) {
        throw new reservationError.InvalidReservationReceived("Invalid Zone with document: " + reservation.DocumentId)
      }
    }
       
  }
}

module.exports = ZoneValidator;
