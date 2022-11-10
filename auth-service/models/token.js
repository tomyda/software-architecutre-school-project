const authError = require("../errors/auth-error");

// The purpose of this file is to keep consistency in struct types:
// every token should handle same claims, with equal names.

// TokenDetails is the struct returned after a token is generated.
// It contains the access token and its expiration date.
class TokenDetails {
  constructor(accessToken, expireDate) {
    this.access_token = accessToken;
    this.expire_date = expireDate;
  }
}

// TokenData holds the claims carried by a valid token.
// It holds the following claims: userID, authClientID, expireDate
class TokenData {
  constructor(userID, authClientID, expireDate) {
    this.user_id = userID;
    this.auth_client_id = authClientID;
    this.expire_date = expireDate;
  }

  toJson() {
    return {
      user_id: this.user_id,
      auth_client_id: this.auth_client_id,
      expire_date: this.expire_date,
    };
  }
}

// FullTokenData holds the information associated to a token, and stored in Redis.
// When a token is verified, a FullTokenData is returned.
// It holds the following claims: userID, authClientID, expireDate, extraClaim
class FullTokenData {
  constructor(userID, authClientID, expireDate, extraClaim) {
    this.user_id = userID;
    this.auth_client_id = authClientID;
    this.expire_date = expireDate;
    this.extra_claim = extraClaim;
  }

  toJson() {
    return {
      user_id: this.user_id,
      auth_client_id: this.auth_client_id,
      expire_date: this.expire_date,
      extra_claim: this.extra_claim,
    };
  }
}

module.exports = {
  TokenDetails,
  TokenData,
  FullTokenData,
};
