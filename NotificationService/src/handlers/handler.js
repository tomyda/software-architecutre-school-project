const fetch = require("node-fetch");
const notificationErr = require("./../errors/notification_error");
const config = require("./../config/config");
const configStruct = config.getConfig();

async function authenticationHandler(req, res, next) {
  const token = req.header("auth-token");
  if (!token) {
    let error = new notificationErr.InvalidTokenError("No token provided");
    return res.status(error.status).json(error);
  }

  try {
    var resultAsJson;
    var error;
    await fetch(configStruct.auth_service.verify_address, {
      method: "POST",
      headers: { "auth-token": token },
    })
      .then((data) => data.json())
      .then((json) => {
        resultAsJson = json;
      })
      .catch((err) => {
        error = err;
      });

    if (error) {
      throw new notificationErr.InvalidTokenError(error.message);
    }
    if (resultAsJson.status && resultAsJson.status != 200) {
      if (resultAsJson.message) {
        throw new notificationErr.InvalidTokenError(
          resultAsJson.message,
          resultAsJson.status
        );
      }
      throw new notificationErr.InvalidTokenError(
        "internal error",
        resultAsJson.status
      );
    }

    req.user_in_control = resultAsJson;
    next();
  } catch (error) {
    if (!error.status) {
      error.status = 401;
    }
    return res.status(error.status).json(error);
  }
}

module.exports = {
  authentication: authenticationHandler,
};
