const uuid = require("uuid");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const authError = require("../errors/auth-error");

const revokeToken = async (token, redisClient) => {
  try {
    // We create this to use redis 'del' as a promise.
    const delAsync = promisify(redisClient.del).bind(redisClient);

    // Validations
    if (!token) {
      throw new authError.NoTokenReceivedErr();
    }

    // Remove token from white-list (redis)
    return await delAsync(token)
      .then((data) => {})
      .catch((err) => {
        throw err;
      });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  revokeToken: revokeToken,
};
