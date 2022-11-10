const Util = require("util");

class AbstractLogger {
  construct() {
    Util.inherits(AbstractLogger);
  }

  error(message, label) {
    throw new Error("Not implemented");
  }

  warn(message, label) {
    throw new Error("Not implemented");
  }

  info(message, label) {
    throw new Error("Not implemented");
  }

  verbose(message, label) {
    throw new Error("Not implemented");
  }

  debug(message, label) {
    throw new Error("Not implemented");
  }

  silly(message, label) {
    throw new Error("Not implemented");
  }
}

module.exports = AbstractLogger;
