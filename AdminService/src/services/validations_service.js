const fetch = require("node-fetch");
const Validations = require("../models/validation");
const adminErr = require("./../error/admin_error");
const config = require("./../config/config");
const configStruct = config.getConfig();
const Logger = require("../../logger/src/logger");
const logger = new Logger();

const getValidations = async (req) => {
  //1) Validate User in Control Privileges
  if (
    req.user_in_control.auth_client_id != "superadmin" &&
    req.user_in_control.auth_client_id != "admin" &&
    req.user_in_control.auth_client_id != "service"
  ) {
    throw new adminErr.InvalidUserInControlError(
      "only 'superadmin' and 'admin' or 'service' can retrieve current validations"
    );
  }

  // 2) Return Validations
  let result = await req.adminDB
    .model("validation", Validations.validationSchema)
    .find({})
    .then((data) => {
      return data;
    })
    .catch((err) => {
      return err;
    });

  if (result instanceof Error) {
    throw result;
  }

  return result;
};

const addValidations = async (req) => {
  logger.info(
    "The user with id: " +
      req.user_in_control.user_id +
      " requested to add a new validation",
    __filename.split("src")[1]
  );
  var newFilters = req.body.validations;

  // 1) Validate User in Control Privileges
  if (
    req.user_in_control.auth_client_id != "superadmin" &&
    req.user_in_control.auth_client_id != "admin"
  ) {
    logger.error(
      "The user with id " +
        req.user_in_control.user_id +
        " could not add validations as his role is not superadmin. current role: " +
        req.user_in_control.auth_client_id,
      __filename.split("src")[1]
    );
    throw new adminErr.InvalidUserInControlError(
      "only 'superadmin' can add new validations"
    );
  }

  // 2) Add new Validations
  filters = await getAllAvailableFilters();
  let invalidValidations = [];
  let repeatedValidations = [];
  let validValidations = [];

  let invalidTransformations = [];
  let repeatedTransformations = [];
  let validTransformations = [];

  // Validate new validation is valid
  for (const filter of newFilters) {
    if (
      filters.validations.includes(filter.name) &&
      filter.type == "validation"
    ) {
      // Validate new validations are not already selected (in db)
      await req.adminDB
        .model("validation", Validations.validationSchema)
        .findOne({ name: filter.name }, null, null, (err, res) => {
          if (err || res) {
            return repeatedValidations.push(filter);
          } else {
            validValidations.push(filter);
          }
        });
    } else {
      if (filter.type == "validation") {
        invalidValidations.push(filter);
      }
    }

    if (
      filters.transformations.includes(filter.name) &&
      filter.type == "transformation"
    ) {
      // Validate new validations are not already selected (in db)
      await req.adminDB
        .model("validation", Validations.validationSchema)
        .findOne({ name: filter.name }, null, null, (err, res) => {
          if (err || res) {
            return repeatedTransformations.push(filter);
          } else {
            validTransformations.push(filter);
          }
        });
    } else {
      if (filter.type == "transformation") {
        invalidTransformations.push(filter);
      }
    }
  }

  if (invalidValidations.length != 0) {
    logger.error(
      "The user with id " +
        req.user_in_control.user_id +
        " could not add validations as the validations are invalid: " +
        req.body.new_validations,
      __filename.split("src")[1]
    );
    throw new adminErr.UnknownFilterError(invalidValidations.pop());
  }
  if (invalidTransformations.length != 0) {
    logger.error(
      "The user with id " +
        req.user_in_control.user_id +
        " could not add validations as the validations are invalid: " +
        req.body.new_validations,
      __filename.split("src")[1]
    );
    throw new adminErr.UnknownFilterError(invalidValidations.pop());
  }
  if (repeatedValidations.length != 0) {
    logger.error(
      "The user with id " +
        req.user_in_control.user_id +
        " could not add validations as one or more validations already exist. validations requested to add: " +
        req.body.new_validations,
      __filename.split("src")[1]
    );
    throw new adminErr.RepeatedFilterError(repeatedValidations.pop());
  }

  if (repeatedTransformations.length != 0) {
    logger.error(
      "The user with id " +
        req.user_in_control.user_id +
        " could not add validations as one or more validations already exist. validations requested to add: " +
        req.body.new_validations,
      __filename.split("src")[1]
    );
    throw new adminErr.RepeatedFilterError(repeatedValidations.pop());
  }

  // We add each new validation to the db
  for (const validValidation of validValidations) {
    var model = req.adminDB.model("validation", Validations.validationSchema);
    await model.create({
      name: validValidation.name,
      type: "validation",
      atEnd: validValidation.atEnd
    });
  }

  for (const validTransformation of validTransformations) {
    var model = req.adminDB.model(
      "transformation",
      Validations.validationSchema
    );
    await model.create({
      name: validTransformation.name,
      type: "transformation",
    });
  }

  return validValidations.length + validTransformations.length;
};

const deleteValidations = async (req) => {
  logger.info(
    "The user with id: " +
      req.user_in_control.user_id +
      " requested to delete the validations: " +
      req.body.validations_to_delete,
    __filename.split("src")[1]
  );
  var validationsToDelete = req.body.validations;

  // 1) Validate User in Control Privileges
  if (
    req.user_in_control.auth_client_id != "superadmin" &&
    req.user_in_control.auth_client_id != "admin"
  ) {
    logger.error(
      "The user with id " +
        req.user_in_control.user_id +
        " can not delete validations as his role is not superadmin. current role: " +
        req.user_in_control.auth_client_id,
      __filename.split("src")[1]
    );
    throw new adminErr.InvalidUserInControlError(
      "only 'superadmin' can remove validations"
    );
  }

  // 2) Delete Validations
  let notRemovedValidations = [];

  for (const validation of validationsToDelete) {
    await req.adminDB
      .model("validation", Validations.validationSchema)
      .deleteOne({ name: validation.name }, function (err, result) {
        if (err) {
          notRemovedValidations.push(validation);
        }
      });
  }

  if (notRemovedValidations.length != 0) {
    let notRemovedAsStrings = "";
    for (const validation of notRemovedValidations) {
      notRemovedAsStrings = notRemovedAsStrings + validation.name + ", ";
    }
    logger.info(
      "The user with id: " +
        req.user_in_control.user_id +
        " coult not remove the validations due to an internal problem: ",
      __filename.split("src")[1]
    );
    throw new adminErr.SomeValidationsWerentRemovedError(notRemovedAsStrings);
  }
};

const getAllAvailableFilters = async () => {
  var resultAsJson;
  var error;

  await fetch(configStruct.processor_service.address)
    .then((data) => data.json())
    .then((json) => {
      resultAsJson = json;
    })
    .catch((err) => {
      error = err;
    });

  if (error) {
    throw new adminErr.UnableToAddValidation(error.message);
  }
  return resultAsJson;
};

module.exports = {
  addValidations,
  deleteValidations,
  getValidations,
};
