class ProviderError extends Error {
  constructor(message, status) {
    super();

    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;

    this.message =
      message || "Something went wrong and caused a provider error.";

    this.status = status || 500;
  }
}

class CitizenNotFound extends ProviderError {
  constructor() {
    super("Citizen not found in system", 404);
  }
}

module.exports = {
  ProviderError,
  CitizenNotFound,
};
