const AbstractValidator = require("./abstract-validator");
const reservationError = require("../errors/reservation_error")

class CellphoneValidator extends AbstractValidator {
  constructor() {
    super();
    this.name = "cellphone-validator";
    this.description = "Valides cellphone is not empty, that is 9 digits and has prefix 09";
    this.atEnd = false;
  }

  Validate() {
    return (reservation) => {
        //Como el celular se agregó de tipo numero a la base de datos, todos los 0s se borraron,
        //por lo tanto es de 8 digitos la validacion
        if (reservation.Cellphone == "" || reservation.Cellphone.toString().length != 8 || reservation.Cellphone == "null") {
          throw new reservationError.InvalidReservationReceived("Invalid cellphone with document: "+ reservation.DocumentId + " The cellphone must be 9 digits")
        }
  }
}
}

module.exports = CellphoneValidator;
