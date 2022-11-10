class AuthenticationError extends Error {
  constructor(message, status) {
    super();

    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;

    this.message =
      message || "Something went wrong and caused an authentication error.";

    this.status = status || 500;
  }
}

class InvalidTokenErr extends AuthenticationError {
  constructor(message) {
    super(message || "The provided token is invalid", 403);
  }
}

class ModifiedTokenErr extends AuthenticationError {
  constructor(message) {
    super(
      message || "The provided token is invalid, as it was manipulated",
      403
    );
  }
}

class ExpiredTokenErr extends AuthenticationError {
  constructor(message) {
    super(message || "The provided token has expired", 400);
  }
}

class NoTokenReceivedErr extends AuthenticationError {
  constructor(message) {
    super(message || "There was no token provided", 400);
  }
}

class GeneralAuthErr extends AuthenticationError {
  constructor(message, status) {
    super(
      message || "Something went wrong and caused an authentication error.",
      status || 500
    );
  }
}

module.exports = {
  ExpiredTokenErr,
  InvalidTokenErr,
  NoTokenReceivedErr,
  GeneralAuthErr,
  ModifiedTokenErr,
};
