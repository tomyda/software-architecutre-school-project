const AbstractValidator = require("./abstract-validator");
const reservationError = require("../errors/reservation_error")

class CiFormatValidator extends AbstractValidator {
  constructor() {
    super();
    this.name = "ci-format-validator";
    this.description =
      "Valides the ci is not empty, has between 7 and 8 characters without dots and dashes";
      this.atEnd = false;
  }

  Validate() {
    return (reservation) => {
        if (
          isNaN(reservation.DocumentId) || 
          reservation.DocumentId.toString().length < 7 ||
          reservation.DocumentId.toString().length > 8 ||
          reservation.DocumentId.toString().includes(".") ||
          reservation.DocumentId.toString().includes("-") ||
          reservation.DocumentId.toString() == "" || 
          reservation.DocumentId.toString() == "null"
        ) {
          if (
            reservation.DocumentId.toString().length < 7 ||
            reservation.DocumentId.toString().length > 8
          ) {
            throw new reservationError.InvalidReservationReceived("Invalid document " + reservation.DocumentId + "It must be 7 or 8 characters.")
          }
          if (
            reservation.DocumentId.toString().includes(".") ||
            reservation.DocumentId.toString().includes("-")
          ) {
            throw new reservationError.InvalidReservationReceived("Invalid document " + reservation.DocumentId + "It must not have dots or slashes.")
          }
          if (isNaN(reservation.DocumentId)) {
            throw new reservationError.InvalidReservationReceived("Invalid document " + reservation.DocumentId + "It must be a numeric field.")
          }
          throw new reservationError.InvalidReservationReceived("Invalid document " + reservation.DocumentId)
        }
      }
  }
}

module.exports = CiFormatValidator;
