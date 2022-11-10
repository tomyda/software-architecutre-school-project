const jwt = require("jsonwebtoken");

const generateService = require("./../services/generate_token_service");
const verifyService = require("./../services/verify_token_service");
const revokeService = require("./../services/revoke_token_service");

const generateForService = async (req, res) => {
  try {
    const userID = req.body.user_id;
    const authClientID = "service";
    const token = await generateService.generateServiceToken(
      userID,
      authClientID,
      req.redis
    );
    res.status(201).header("auth-header", token).json(token);
  } catch (error) {
    if (!error.status) {
      error.status = 500;
    }
    res.status(error.status).json(error);
  }
};

const generate = async (req, res) => {
  try {
    const userID = req.body.user_id;
    const authClientID = req.body.auth_client_id;
    const token = await generateService.generateToken(
      userID,
      authClientID,
      req.redis
    );
    res.status(201).header("auth-header", token).json(token);
  } catch (error) {
    if (!error.status) {
      error.status = 500;
    }
    res.status(error.status).json(error);
  }
};

const verify = async (req, res) => {
  try {
    const receivedToken = req.header("auth-token");
    const verifiedToken = await verifyService.verifyToken(
      receivedToken,
      req.redis
    );
    res.status(200).json(verifiedToken);
  } catch (error) {
    res.status(error.status).json(error);
  }
};

const revoke = async (req, res) => {
  try {
    const receivedToken = req.header("auth-token");
    await revokeService.revokeToken(receivedToken, req.redis);
    res.status(200).json("token successfully revoked");
  } catch (error) {
    res.status(error.status).json(error);
  }
};

module.exports = {
  generateForService,
  generate,
  verify,
  revoke,
};
