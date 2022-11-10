const AbstractValidator = require("./abstract-validator");

class CiCheckDigitValidator extends AbstractValidator {
  constructor() {
    super();
    this.name = "ci-check-digit-validator";
    this.description = "Valides the check digit of the ci is correct";
    this.atEnd = false;
  }

  Validate() {
    return async (input, next) => {
      // TODO: IMPLEMENT
      // try {
      //   //Algorithm
      //   //TODO: sacarlo a una clase aparte
      //   let ci = input.DocumentId
      //   var a = 0;
      //   var i = 0;
      //   var result = 0;
      //   if (ci.length <= 6) {
      //     for (i = ci.length; i < 7; i++) {
      //       ci = "0" + ci;
      //     }
      //   }
      //   for (i = 0; i < 7; i++) {
      //     a += (parseInt("2987634"[i]) * parseInt(ci[i])) % 10;
      //   }
      //   if (a % 10 === 0) {
      //     result = 0;
      //   } else {
      //     result = 10 - (a % 10);
      //   }

      //   //TODO: falta terminar
      //   if (input.DocumentId == "") {
      //     next("Invalid document. The document does not exist.", input);
      //     return;
      //   }
      //   next(null, input);
      //   return;
      // } catch (error) {
      //   next("Invalid document. The document does not exist", input);
      // }
    };
  }
}

module.exports = CiCheckDigitValidator;
