const DATE_FORMAT = "dd/MM/yyyy";
var format = require("date-format");
const reservationError =  require("../errors/reservation_error")
const AbstractTransformation = require("./abstract-transformation");

class DateTransformation extends AbstractTransformation {
  constructor() {
    super();
    this.name = "date-transformation";
    this.description =
      "Accepts all types of dates and transformes it to dd/MM/yyyy .";
    this.field = "ReservationDate";
  }
  Transform() {
    return (reservation) => {
      var formatedDate
      try{
        formatedDate = format.asString(
          DATE_FORMAT,
          new Date(reservation.ReservationDate)
        );
      }catch(err){
        throw new reservationError.InvalidReservationReceived("Invalid date with document: " + reservation.DocumentId)
      }
      if (formatedDate && !isNaN(new Date(reservation.ReservationDate))) {
        // reservation.ReservationDate = formatedDate
        let resDate = new Date(reservation.ReservationDate)
        if (resDate > new Date()) {
          return reservation
        }
        throw new reservationError.InvalidReservationReceived("Invalid date (from past) with document: " + reservation.DocumentId)
      }else{
        throw new reservationError.InvalidReservationReceived("Invalid date with document: " + reservation.DocumentId)
      }
  }
}
}

module.exports = DateTransformation;
