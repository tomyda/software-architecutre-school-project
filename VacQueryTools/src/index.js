const express = require("express");
const expressApp = express();

const app = require("./app");
const config = require("./config/config");
const configStruct = config.getConfig();

app.initApp(expressApp);

expressApp.listen(configStruct.app.port, () => {
  console.log(`Vac Query Tools Server is up on ${configStruct.app.address}`);
});
