const uuid = require("uuid");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const fs = require("fs");

const authError = require("../errors/auth-error");
const secretKey = fs.readFileSync("./config/arq_private.key", "utf8");

const verifyToken = async (token, redisClient) => {
  // We create this to use redis 'get' as a promise.
  const getAsync = promisify(redisClient.get).bind(redisClient);

  // Validations
  if (!token) {
    throw new authError.NoTokenReceivedErr();
  }

  let verifiedToken;
  try {
    // TODO: INVESTIGAR... NO DEBERIA VERIFICAR CON LA PUBLIC?
    verifiedToken = jwt.verify(token, secretKey);
  } catch (error) {
    throw new authError.ModifiedTokenErr(error.message);
  }

  currentTimeStamp = Math.floor(Date.now() / 1000);
  if (verifiedToken.ttl - currentTimeStamp <= 0) {
    throw new authError.ExpiredTokenErr();
  }

  // validate it is white-listed
  return await getAsync(token)
    .then((data) => {
      if (!data || data == null) {
        throw new authError.InvalidTokenErr();
      }
      return JSON.parse(data);
    })
    .catch((err) => {
      if (!err.status) {
        err.status;
      }
      throw err;
    });
};

module.exports = {
  verifyToken: verifyToken,
};
