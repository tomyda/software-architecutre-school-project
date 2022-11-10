const fetch = require("node-fetch");
const Configurations = require("../models/configuration");
const adminErr = require("./../error/admin_error");
const config = require("./../config/config");
const configStruct = config.getConfig();
const Logger = require("../../logger/src/logger");
const logger = new Logger();

const getEndpoint = async (req) => {
  // TODO: UnComment this after adding auth handler to route
  // 1) Validate User in Control Privileges
  // if (req.user_in_control.auth_client_id != "superadmin" && req.user_in_control.auth_client_id != "admin") {
  //   throw new adminErr.InvalidUserInControlError("only 'superadmin' and 'admin' can retrieve current validations")
  // }

  // 2) Return Validations
  let result = await req.adminDB
    .model("configuration", Configurations.configurationSchema)
    .find({})
    .then((data) => {
      return data;
    })
    .catch((err) => {
      return err;
    });

  if (result instanceof Error) {
    // logger.error(
    //   "The user with id " +
    //     req.user_in_control.user_id +
    //     " could not get the available validations due to an error getting the validations. error: " +
    //     result,
    //   __filename.split("src")[1]
    // );
    throw result;
  }

  // logger.info(
  //   "The user with id: " +
  //     req.user_in_control.user_id +
  //     " successfully got the current available validations",
  //   __filename.split("src")[1]
  // );
  return result;
};

const addEndpoint = async (req) => {
  logger.info(
    " A user requested to add a new endpoint",
    __filename.split("src")[1]
  );
  var endpoint = req.body;

  // 1) Validate User in Control Privileges
  //   if (req.user_in_control.auth_client_id != 'superadmin') {
  //     logger.error(
  //       'The user with id ' +
  //         req.user_in_control.user_id +
  //         ' could not add validations as his role is not superadmin. current role: ' +
  //         req.user_in_control.auth_client_id,
  //       __filename.split('src')[1],
  //     )
  //     throw new adminErr.InvalidUserInControlError(
  //       "only 'superadmin' can add new validations",
  //     )
  //   }

  if (
    endpoint.service != "id provider" &&
    endpoint.service != "notificationSuccessful" &&
    endpoint.service != "notificationPending" &&
    endpoint.service != "notificationCancellation"
  ) {
    logger.error(
      "A user wanted to configure a not existing confifuration. ",
      __filename.split("src")[1]
    );
    throw new adminErr.InvalidEnpoint(
      "The service must be id provider, notificationSuccessful or notificationPending."
    );
  }

  var repeatedEndpoint;

  if (endpoint.service == "id provider") {
    await req.adminDB
      .model("configuration", Configurations.configurationSchema)
      .findOne({ service: "id provider" }, null, null, (err, res) => {
        if (err || res) {
          return (repeatedEndpoint = true);
        } else {
          return (repeatedEndpoint = false);
        }
      });

    if (repeatedEndpoint) {
      logger.error(
        " A user wanted to configure a not existing configuration. ",
        __filename.split("src")[1]
      );
      throw new adminErr.InvalidEnpoint(
        "The provider service can have only one configuration."
      );
    }
  }

  var model = req.adminDB.model(
    "configurations",
    Configurations.configurationSchema
  );

  var error;
  await model
    .create({
      endpoint: endpoint.endpoint,
      service: endpoint.service,
    })
    .then()
    .catch((err) => {
      error = err;
      return error;
    });

  if (error) {
    throw new adminErr.InvalidEnpoint("Error adding the endpoint.");
  } else {
    return { message: "Endpoint added successfully" };
  }
};

const deleteEndpoint = async (req) => {
  logger.info(
    "A user requested to delete the validations: " +
      req.body.validations_to_delete,
    __filename.split("src")[1]
  );

  var endpointToDelete = req.body;

  // 1) Validate User in Control Privileges
  // if (req.user_in_control.auth_client_id != "superadmin") {
  //   logger.error(
  //     "The user with id " +
  //       req.user_in_control.user_id +
  //       " can not delete validations as his role is not superadmin. current role: " +
  //       req.user_in_control.auth_client_id,
  //     __filename.split("src")[1]
  //   );
  //   throw new adminErr.InvalidUserInControlError(
  //     "only 'superadmin' can remove validations"
  //   );
  // }

  // 2) Delete Validations

  var error;
  await req.adminDB
    .model("configuration", Configurations.configurationSchema)
    .deleteOne(
      {
        endpoint: endpointToDelete.endpoint,
        service: endpointToDelete.service,
      },
      function (err, result) {
        if (err) {
          error = err;
          return error;
        }
      }
    );

  if (error) {
    throw new adminErr.InvalidEnpoint("Error deleting the endpoint: " + error);
  } else {
    return { message: "Endpoint deleted successfully" };
  }
};

module.exports = {
  addEndpoint,
  getEndpoint,
  deleteEndpoint,
};
