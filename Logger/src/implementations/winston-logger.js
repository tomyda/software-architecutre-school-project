const AbstractLogger = require("../abstract_logger");
const config = require("./../config/config");
const winston = require("winston");
const configStruct = config.getConfig();

const transportErrorFile =
  configStruct.logger.transport_error_file || "error.log";
const transportCombinedFile =
  configStruct.logger.transport_combined_file || "combined.log";
const shouldLogToConsole = configStruct.logger.enable_console_logging || false;
const level = configStruct.logger.level || "info";

const format = winston.format.printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level} -> ${message}`;
});

const logger = winston.createLogger({
  level: level,
  format: winston.format.combine(winston.format.timestamp(), format),
  transports: [
    new winston.transports.File({
      filename: transportErrorFile,
      level: "error",
    }),
    new winston.transports.File({ filename: transportCombinedFile }),
  ],
});

if (shouldLogToConsole) {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

class WinstonLogger extends AbstractLogger {
  error(message, label) {
    logger.log("error", message, { label: label });
  }

  warn(message, label) {
    logger.log("warn", message, { label: label });
  }

  info(message, label) {
    logger.log("info", message, { label: label });
  }

  verbose(message, label) {
    logger.log("verbose", message, { label: label });
  }

  debug(message, label) {
    logger.log("debug", message, { label: label });
  }

  silly(message, label) {
    logger.log("silly", message, { label: label });
  }
}

module.exports = WinstonLogger;
