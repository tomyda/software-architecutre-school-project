const fetch = require("node-fetch");
const mongoose = require("mongoose");

const Validations = require("../models/validation");
const config = require("./../config/config");
const Logger = require("../../logger/src/logger");
const vaccinatedUserErrors = require("../error/vaccinated_user_error");

const configStruct = config.getConfig();
const logger = new Logger();

const markUserAsVaccinated = async (req) => {
  const centerCode = req.query.vaccination_center_code;
  const document = req.query.document;
  const vaccinationDate = req.query.vaccination_date;

  logger.info(
    "The user with id " +
      req.user_in_control.user_id +
      " requested to mark user with id " +
      req.query.document +
      " as vaccinated."
  );

  //1) Validate User in Control Privileges
  if (
    req.user_in_control.auth_client_id != "superadmin" &&
    req.user_in_control.auth_client_id != "vaccinator"
  ) {
    logger.error(
      "The user with id " +
        req.user_in_control.user_id +
        " could not set person as vaccinated as his role is not superadmin or vaccinator. current role: " +
        req.user_in_control.auth_client_id,
      __filename.split("src")[1]
    );
    throw new vaccinatedUserErrors.ErrorSettingUserAsVaccinated(
      "only 'superadmin' or 'vaccinator' can set user as vaccinated"
    );
  }

  // 2) Validate Date
  const dateTransformed = validateVaccinationDate(vaccinationDate);

  // 3) Edit user in db
  documentFilter = {
    vaccination_center_code: centerCode,
    document: Number(document),
  };
  newFields = {
    was_vaccinated: true,
    vaccination_date: dateTransformed,
  };
  const wasUserMarkedAsVaccinated = await markUserAsVaccinatedInDb(
    req,
    documentFilter,
    newFields
  );
  if (!wasUserMarkedAsVaccinated) {
    throw new vaccinatedUserErrors.UserWasNotFoundInVaccinationCenter();
  }
};

const markUserAsVaccinatedInDb = async (req, documentFilter, newFields) => {
  return await req.reservationsDB
    .collection(configStruct.mongo_reservations.reservations_collection)
    .updateOne(documentFilter, { $set: newFields })
    .then((data) => {
      if (data.modifiedCount == 0) {
        logger.error(
          "the user with id ... could not be found in vaccination center ..."
        );
        return false;
      }
      return true;
    })
    .catch((error) => {
      logger.error(
        "error accessing the database to mark user with id ... as vaccinated."
      );
      return false;
    });
};

const validateVaccinationDate = (vaccinationDate) => {
  var vaccinationDateTransformed;

  try {
    vaccinationDateTransformed = new Date(vaccinationDate);
  } catch (err) {
    throw new vaccinatedUserErrors.InvalidVaccinationDate(
      "invalid date format."
    );
  }

  if (
    vaccinationDateTransformed < new Date("January 1, 2020 00:00:00") ||
    vaccinationDateTransformed > new Date()
  ) {
    throw new vaccinatedUserErrors.InvalidVaccinationDate(
      "invalid vaccination date."
    );
  }

  return vaccinationDateTransformed;
};

module.exports = {
  markUserAsVaccinated,
};
