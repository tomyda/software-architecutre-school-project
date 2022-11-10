const fetch = require('node-fetch')
const AbstractValidator = require("./abstract-validator");
const processorErr = require("./../errors/reservation_error")
const config = require("./../config/config")
const configStruct = config.getConfig()

class IDProviderValidator extends AbstractValidator {
    constructor() {
        super();
        this.name = "id-provider-validator";
        this.description = "Valides reservation user exists";
        this.atEnd = true;
    }

    Validate() {
        return async (reservation,req) => {
            var resultAsJson
            var error
            let address = req.configuration.idProvider.endpoint + "?id=" + reservation.DocumentId
            await fetch(address, 
                { method: "GET"})
                .then((data) => data.json())
                .then((json) => {
                    resultAsJson = json
                })
                .catch((err) => {
                    error = err
                })
            
            if (error) {
                throw new processorErr.ReservationsError("Error validating user againt ID Provider. Document: " + reservation.DocumentId, 500)
            }
            if (resultAsJson.status && resultAsJson.status != 200) {
                if (resultAsJson.message) {
                    throw new processorErr.ReservationsError(resultAsJson.message, resultAsJson.status)
                }
                throw new processorErr.ReservationsError("Error validating user againt ID Provider. Document: " + reservation.DocumentId, resultAsJson.status)
            }
            
            let age = calculateAge(resultAsJson.DateOfBirth, reservation)

            reservation.age = age
            reservation.priority_group = resultAsJson.Priority
            // reservation.age = 20
            // reservation.priority_group = 1
        }
    }
}

// TODO: DOCUMENT THAT THIS FUNCTION SHOULD BE MODIFIABLE ==> EACH IMPLEMENTATION OF THE SYSTEM SHOULD IMPLEMENT THIS BASED ON THE IdProvider
const calculateAge = (dob, reservation) => {
    var nowDate = new Date()
    var splitted = dob.split("-")

    let age = 0

    age = nowDate.getFullYear() - splitted[0] -1

    if (splitted[1] < nowDate.getMonth()) {
        age = age + 1
    } else if (splitted[1] == nowDate.getMonth()) {
        if (splitted[2] < nowDate.getDay()) {
            age = age + 1    
        }    
    }

    if (age > 106 || age < 18) {
        throw new processorErr.ReservationsError("Invalid Citizen Age: must be between 18 and 106. Document: " + reservation.DocumentId, 400)
    }

    return age

}

module.exports = IDProviderValidator;
