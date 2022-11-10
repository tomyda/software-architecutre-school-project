const AbstractLogger = require("../abstract-logger");
const config = require("../config/config");
const log4js = require("log4js");
const configStruct = config.getConfig();

const transportCombinedFile =
  configStruct.logger.transport_combined_file || "combined.log";
const level = configStruct.logger.level || "info";

log4js.configure({
  appenders: {
    combined: { type: "file", filename: transportCombinedFile },
  },
  categories: {
    default: { appenders: ["combined"], level: level },
  },
});

const logger = log4js.getLogger();
logger.level = level;

class Log4JsLogger extends AbstractLogger {
  error(message, label) {
    logger.error(`[${label}] -> ${message}`);
  }

  warn(message, label) {
    logger.warn(`[${label}] -> ${message}`);
  }

  info(message, label) {
    logger.info(`[${label}] -> ${message}`);
  }

  verbose(message, label) {
    logger.trace(`[${label}] -> ${message}`);
  }

  debug(message, label) {
    logger.debug(`[${label}] -> ${message}`);
  }

  silly(message, label) {
    logger.debug(`[${label}] -> ${message}`);
  }
}

module.exports = Log4JsLogger;
