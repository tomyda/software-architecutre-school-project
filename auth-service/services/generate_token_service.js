const uuid = require("uuid");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const fs = require("fs");

const authError = require("../errors/auth-error");
const tokenModels = require("../models/token");
const config = require("./../config/config");

const secretKey = fs.readFileSync("./config/arq_private.key", "utf8");

const generateServiceToken = async (userID, authClientID, redisClient) => {
  // We create this to use redis 'set' as a promise.
  const setAsync = promisify(redisClient.set).bind(redisClient);

  // Validations
  if (!userID || !authClientID) {
    throw new authError.GeneralAuthErr(
      "invalid json body: missing claims",
      400
    );
  }
  if (uuid == "") {
    throw new authError.GeneralAuthErr("Invalid service ID provided", 400);
  }
  if (authClientID == "") {
    throw new authError.GeneralAuthErr("Invalid auth client ID provided", 400);
  }

  // Create Token
  const tokenData = new tokenModels.TokenData(userID, authClientID, "");
  const tokenAsJson = tokenData.toJson();

  let token = jwt.sign(tokenAsJson, secretKey);

  // Add token to Redis
  const fullTokenData = new tokenModels.FullTokenData(
    userID,
    authClientID,
    "",
    true
  );

  return await setAsync(token, JSON.stringify(fullTokenData))
    .then((data) => {
      return new tokenModels.TokenDetails(token, "");
    })
    .catch((err) => {
      throw err;
    });
};

const generateToken = async (userID, authClientID, redisClient) => {
  // We create this to use redis 'setex' as a promise.
  const setexAsync = promisify(redisClient.setex).bind(redisClient);

  // Validations
  if (!userID || !authClientID) {
    throw new authError.GeneralAuthErr(
      "invalid json body: missing claims",
      400
    );
  }
  if (!uuid.validate(userID)) {
    throw new authError.GeneralAuthErr("Invalid user ID provided", 400);
  }
  if (authClientID == "") {
    throw new authError.GeneralAuthErr("Invalid auth client ID provided", 400);
  }

  // Create Token
  const expiration = 60 * config.getConfig().jwt_config.expiration_in_mins;
  const tokenTTL = Math.floor(Date.now() / 1000) + expiration; // its divided 1000 as its in milliseconds, but expiration is in seconds
  const tokenData = new tokenModels.TokenData(userID, authClientID, tokenTTL);
  const tokenAsJson = tokenData.toJson();

  let token = jwt.sign(tokenAsJson, secretKey);

  // Add token to Redis
  const fullTokenData = new tokenModels.FullTokenData(
    userID,
    authClientID,
    tokenTTL,
    true
  );

  return await setexAsync(token, expiration, JSON.stringify(fullTokenData))
    .then((data) => {
      return new tokenModels.TokenDetails(token, tokenTTL);
    })
    .catch((err) => {
      throw err;
    });
};

module.exports = {
  generateToken: generateToken,
  generateServiceToken,
};
