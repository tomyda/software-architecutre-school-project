class VaccinatedUserError extends Error {
  constructor(message, status) {
    super();

    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;

    this.message = message || "Something went wrong. Please try again.";

    this.status = status || 500;
  }
}

class UserDoesNotExistInVaccinationCenter extends VaccinatedUserError {
  constructor(message) {
    super(
      message ||
        "Unable to find a user with the given document in this vaccination center",
      400
    );
  }
}

class ErrorSettingUserAsVaccinated extends VaccinatedUserError {
  constructor(message) {
    super(message || "Error setting user as vaccinated", 400);
  }
}

class InvalidVaccinationDate extends VaccinatedUserError {
  constructor(message) {
    super(message || "Invalid vaccination date", 400);
  }
}

class UserWasNotFoundInVaccinationCenter extends VaccinatedUserError {
  constructor(message) {
    super(message || "The user was not found in the vaccination center", 400);
  }
}

module.exports = {
  UserDoesNotExistInVaccinationCenter,
  ErrorSettingUserAsVaccinated,
  InvalidVaccinationDate,
  UserWasNotFoundInVaccinationCenter,
};
