class AdminError extends Error {
  constructor(message, status) {
    super();

    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;

    this.message = message || "Something went wrong. Please try again.";

    this.status = status || 500;
  }
}

class ValidationError extends AdminError {
  constructor(message) {
    super(message || "Error with validations", 400);
  }
}

class InvalidNewQuota extends AdminError {
  constructor(cause) {
    if (cause) {
      cause = "Invalid new quota: " + cause;
    }
    super(cause || "Invalid new quota generated an error", 400);
  }
}

class InvalidEnpoint extends AdminError {
  constructor(message) {
    super(message || "Invalid enpoint", 400);
  }
}

class VaccinationCenterNotFound extends AdminError {
  constructor(cause) {
    super(cause || "Vaccination center not found", 404);
  }
}

class VaccinationCenterRepeated extends AdminError {
  constructor(cause) {
    super(cause || "Vaccination center repeated", 400);
  }
}

class UnableToAddValidation extends AdminError {
  constructor(cause, status) {
    super(cause || "Unable to add Validation", status || 500);
  }
}

class UnknownFilterError extends AdminError {
  constructor(unknownFilter) {
    super("Filter Unknown", 400);
  }
}

class RepeatedFilterError extends AdminError {
  constructor(unknownFilter) {
    super("Filter Already in DB", 400);
  }
}

class SomeValidationsWerentRemovedError extends AdminError {
  constructor(validationsAsOneString) {
    super(
      "The following validations could not be removed: " +
        validationsAsOneString,
      500
    );
  }
}

class InvalidTokenError extends AdminError {
  constructor(error, status) {
    super("Invalid Token (when verify, failed): " + error, 401 || status);
  }
}

class InvalidCredentialsError extends AdminError {
  constructor() {
    super("Invalid Credentials: wrong email or password", 401);
  }
}

class InvalidEmailError extends AdminError {
  constructor() {
    super("Invalid Credentials: invalid email", 400);
  }
}

class ErrorGeneratingToken extends AdminError {
  constructor(cause) {
    super("Error Generating Token: " + cause, 500);
  }
}

class ErrorRevokingToken extends AdminError {
  constructor(cause) {
    super("Error Revoking Token: " + cause, 500);
  }
}

class InvalidUserInControlError extends AdminError {
  constructor(cause) {
    super("Invalid User in Control Error: " + cause, 403);
  }
}

class InvalidNewUserError extends AdminError {
  constructor(cause, status) {
    super("Invalid New User: " + cause, 400 || status);
  }
}

class ErrorAddingNewQuota extends AdminError {
  constructor(cause, status) {
    super("Error adding new quota: " + cause, 500 || status);
  }
}

module.exports = {
  AdminError,
  InvalidNewQuota,
  ValidationError,
  VaccinationCenterNotFound,
  VaccinationCenterRepeated,
  UnableToAddValidation,
  UnknownFilterError,
  RepeatedFilterError,
  SomeValidationsWerentRemovedError,
  InvalidTokenError,
  InvalidCredentialsError,
  InvalidEmailError,
  ErrorGeneratingToken,
  InvalidUserInControlError,
  InvalidNewUserError,
  ErrorRevokingToken,
  ErrorAddingNewQuota,
  InvalidEnpoint,
};
