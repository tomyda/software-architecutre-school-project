const express = require("express");
const expressApp = express();

const app = require("./app");
const config = require("./config/config");
const Logger = require("../logger/src/logger");
const logger = new Logger();
const configStruct = config.getConfig();

app.initApp(expressApp);

expressApp.listen(configStruct.app.port, () => {
  logger.info(`Admin Service is up on ${configStruct.app.address}`);
});
