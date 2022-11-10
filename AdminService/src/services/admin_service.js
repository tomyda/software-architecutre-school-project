const uuid = require("uuid");
const bcrypt = require("bcryptjs");
const fetch = require("node-fetch");
const validator = require("validator");
const generator = require("generate-password");
const Validations = require("../models/validation");
const adminErr = require("./../error/admin_error");
const config = require("./../config/config");
const User = require("./../models/user");
const Logger = require("../../logger/src/logger");
const logger = new Logger();
const configStruct = config.getConfig();

const registerAdmin = async (req) => {
  logger.info(
    "A user with id: " +
      req.user_in_control.user_id +
      " requested to register an admin",
    __filename.split("src")[1]
  );

  var model = req.adminDB.model("user", User.userSchema);

  var newAdminUser = req.body;
  newAdminUser.id = uuid.v4();
  newAdminUser.user_role = "admin";
  newPassword = generator.generate({
    length: 10,
    numbers: true,
    symbols: true,
  });
  const salt = await bcrypt.genSalt(10);
  newAdminUser.password = await bcrypt.hash(newPassword, salt);

  // Validate user role is 'superadmin'
  if (req.user_in_control.auth_client_id != "superadmin") {
    logger.error(
      "The user with id " +
        req.user_in_control.user_id +
        " could not register admins as his role is not superadmin. current role: " +
        req.user_in_control.auth_client_id,
      __filename.split("src")[1]
    );
    throw new adminErr.InvalidUserInControlError(
      "only 'superadmin' can create a new admin"
    );
  }

  // Validate new admin is not already in system (by email)
  let validateAmountErr;
  let filter = { email: newAdminUser.email };
  let result = await req.adminDB
    .model("user", User.userSchema)
    .countDocuments(filter, (err, amount) => {
      if (err) {
        if (err.status) {
          validateAmountErr = new adminErr.InvalidNewUserError(
            err.message,
            err.status
          );
          return;
        } else {
          validateAmountErr = new adminErr.InvalidNewUserError(err.message);
          return;
        }
      }
      if (amount != 0) {
        validateAmountErr = new adminErr.InvalidNewUserError(
          "the admin's email is already registered"
        );
        return;
      }
      return 0;
    });

  if (validateAmountErr) {
    logger.error(
      "The user with id " +
        req.user_in_control.user_id +
        "was unable to create a new admin. error: " +
        validateAmountErr.message,
      __filename.split("src")[1]
    );
    throw validateAmountErr;
  }
  if (result && result != 0) {
    logger.error(
      "The user with id " +
        req.user_in_control.user_id +
        " can not register an admin with email " +
        newAdminUser.email +
        " as the email is already in use",
      __filename.split("src")[1]
    );
    throw new adminErr.InvalidNewUserError(
      "the admin's email is already registered"
    );
  }

  // Add new admin to system
  let saveErr;
  await model
    .create(newAdminUser)
    .then()
    .catch((err) => {
      saveErr = new adminErr.InvalidNewUserError(err, 500);
      return;
    });

  if (saveErr != undefined) {
    return saveErr;
  }

  logger.info(
    "A user with id: " +
      req.user_in_control.user_id +
      " registered an admin successfully",
    __filename.split("src")[1]
  );
  return newPassword;
};

const registerVaccinator = async (req) => {
  logger.info(
    "A user with id: " +
      req.user_in_control.user_id +
      " requested to register a vaccinator",
    __filename.split("src")[1]
  );

  var newVaccinatorUser = req.body;
  var model = req.adminDB.model("user", User.userSchema);

  // var newVaccinatorUser = new User.User(req.body);
  newVaccinatorUser.id = uuid.v4();
  newVaccinatorUser.user_role = "vaccinator";
  newPassword = generator.generate({
    length: 10,
    numbers: true,
    symbols: true,
  });
  const salt = await bcrypt.genSalt(10);
  newVaccinatorUser.password = await bcrypt.hash(newPassword, salt);

  // Validate user role is 'superadmin' or 'admin'
  if (
    req.user_in_control.auth_client_id != "superadmin" &&
    req.user_in_control.auth_client_id != "admin"
  ) {
    logger.error(
      "The user with id " +
        req.user_in_control.user_id +
        " can not register vaccinators as his role is not superadmin or admin. current role: " +
        req.user_in_control.auth_client_id,
      __filename.split("src")[1]
    );
    throw new adminErr.InvalidUserInControlError(
      "only 'superadmin' or 'admin' can create a new vaccinator"
    );
  }

  // Validate new vaccinator is not already in system (by email)
  let validateAmountErr;
  let filter = { email: newVaccinatorUser.email };
  let result = await req.adminDB
    .model("user", User.userSchema)
    .countDocuments(filter, (err, amount) => {
      if (err) {
        if (err.status) {
          validateAmountErr = new adminErr.InvalidNewUserError(
            err.message,
            err.status
          );
          return;
        } else {
          validateAmountErr = new adminErr.InvalidNewUserError(err.message);
          return;
        }
      }
      if (amount != 0) {
        validateAmountErr = new adminErr.InvalidNewUserError(
          "the vaccinator's email is already registered"
        );
        return;
      }
      return 0;
    });
  if (validateAmountErr) {
    logger.error(
      "The user with id " +
        req.user_in_control.user_id +
        " was unable to create a new vaccinator user: " +
        validateAmountErr.message,
      __filename.split("src")[1]
    );
    throw validateAmountErr;
  }
  if (result && result != 0) {
    logger.error(
      "The user with id " +
        req.user_in_control.user_id +
        " can not register a vaccinator with email " +
        newVaccinatorUser.email +
        " as the email is already in use",
      __filename.split("src")[1]
    );
    throw new adminErr.InvalidNewUserError(
      "the vaccinator's email is already registered"
    );
  }

  // Add new vaccinator to system
  let saveErr;
  await model
    .create(newVaccinatorUser)
    .then()
    .catch((err) => {
      saveErr = new adminErr.InvalidNewUserError(err, 500);
      return;
    });

  if (saveErr != undefined) {
    return saveErr;
  }

  logger.info(
    "A user with id: " +
      req.user_in_control.user_id +
      " registered a vaccinator successfully",
    __filename.split("src")[1]
  );
  return newPassword;
};

const logIn = async (req) => {
  logger.info(
    "A user with email: " + req.body.email + " requested to log in",
    __filename.split("src")[1]
  );

  // Validate credentials structurally
  if (!req.body.password || !req.body.email) {
    logger.error(
      "User with email: " +
        req.body.email +
        " request to log in was unsuccessfull due to invalid credentials",
      __filename.split("src")[1]
    );
    throw new adminErr.InvalidCredentialsError();
  }
  if (!validator.isEmail(req.body.email)) {
    logger.error(
      "User with email: " +
        req.body.email +
        " request to log in was unsuccessfull due to invalid email",
      __filename.split("src")[1]
    );
    throw new adminErr.InvalidEmailError();
  }

  // Validate user exists
  var findUserErr;
  let dbUser = await req.adminDB
    .model("user", User.userSchema)
    .findOne({ email: req.body.email }, (err, user) => {
      if (err) {
        if (err.status) {
          findUserErr = new adminErr.InvalidNewUserError(
            err.message,
            err.status
          );
          logger.error(
            "User with email: " + req.body.email + " does not exist",
            __filename.split("src")[1]
          );
          return;
        }
        findUserErr = new adminErr.InvalidNewUserError(err.message);
        return;
      }
    });
  if (findUserErr) {
    logger.error(
      "An error ocurred when the user with email " +
        req.body.email +
        " requested to log in. error: " +
        findUserErr,
      __filename.split("src")[1]
    );
    throw findUserErr;
  }
  if (!dbUser) {
    logger.error(
      "User with email: " +
        req.body.email +
        " was not found in database and therefore could not log in",
      __filename.split("src")[1]
    );
    throw new adminErr.InvalidCredentialsError();
  }

  // Validate credentials
  const validPass = await bcrypt.compare(req.body.password, dbUser.password);
  if (!validPass) {
    logger.error(
      "User with email: " +
        req.body.email +
        " requested to log in with an invalid password",
      __filename.split("src")[1]
    );
    throw new adminErr.InvalidCredentialsError();
  }

  tokenData = {
    user_id: dbUser.id,
    user_email: req.body.email,
    auth_client_id: "admin",
  };

  // Create Token (via auth-service)
  var resultAsJson;
  var error;
  await fetch(configStruct.auth_service.generate_address, {
    method: "POST",
    body: JSON.stringify(tokenData),
    headers: { "Content-Type": "application/json" },
  })
    .then((data) => data.json())
    .then((json) => {
      resultAsJson = json;
    })
    .catch((err) => {
      error = err;
    });

  if (error) {
    logger.error(
      "User with email: " +
        req.body.email +
        " logged in succesfully but an error ocurred while generating the token. error: " +
        error,
      __filename.split("src")[1]
    );
    throw new adminErr.ErrorGeneratingToken(error.message);
  }
  if (resultAsJson.status && resultAsJson.status != 201) {
    if (resultAsJson.message) {
      logger.error(
        "User with email: " +
          req.body.email +
          " logged in succesfully but an error ocurred while generating the token. error: " +
          error,
        __filename.split("src")[1]
      );
      throw new adminErr.ErrorGeneratingToken(resultAsJson.message);
    }
    logger.error(
      "User with email: " +
        req.body.email +
        " logged in succesfully but an error ocurred while generating the token. error: " +
        error,
      __filename.split("src")[1]
    );
    throw new adminErr.ErrorGeneratingToken("internal error");
  }

  logger.info(
    "A user with email: " + req.body.email + " logged in succesfully",
    __filename.split("src")[1]
  );
  return resultAsJson;
};

const logOut = async (req, accessToken) => {
  logger.info(
    "The user with id " + req.user_in_control.user_id + " requested to log out",
    __filename.split("src")[1]
  );
  // Validate user in control is admin/superadmin/vaccinator
  if (
    req.user_in_control.auth_client_id != "superadmin" &&
    req.user_in_control.auth_client_id != "admin" &&
    req.user_in_control.auth_client_id != "vaccinator"
  ) {
    logger.error(
      "The user with id " +
        req.user_in_control.user_id +
        "was unable to log out due to an invalid role: " +
        req.user_in_control.auth_client_id,
      __filename.split("src")[1]
    );
    throw new adminErr.InvalidUserInControlError(
      "user in control not from this service"
    );
  }

  // Revoke token (via auth-service)
  var resultAsJson;
  var error;
  await fetch(configStruct.auth_service.revoke_address, {
    method: "DELETE",
    headers: { "auth-token": accessToken },
  })
    .then((data) => data.json())
    .then((json) => {
      resultAsJson = json;
    })
    .catch((err) => {
      error = err;
    });

  if (error) {
    logger.error(
      "An error occurred while revoking token to user " +
        req.user_in_control.user_id +
        ". error: " +
        error,
      __filename.split("src")[1]
    );
    throw new adminErr.ErrorRevokingToken(error.message);
  }
  if (resultAsJson.status && resultAsJson.status != 200) {
    if (resultAsJson.message) {
      logger.error(
        "An error occurred while revoking token to user " +
          req.user_in_control.user_id +
          ". error: " +
          resultAsJson.message,
        __filename.split("src")[1]
      );
      throw new adminErr.ErrorRevokingToken(resultAsJson.message);
    }
    logger.error(
      "An internal error occurred while revoking token to user " +
        req.user_in_control.user_id,
      __filename.split("src")[1]
    );
    throw new adminErr.ErrorRevokingToken("internal error");
  }

  logger.info(
    "The user with id " +
      req.user_in_control.auth_client_id +
      " logged out succesfully",
    __filename.split("src")[1]
  );
};

module.exports = {
  registerAdmin,
  registerVaccinator,
  logIn,
  logOut,
};
