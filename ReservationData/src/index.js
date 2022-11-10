const reservationsController = require("./controllers/reservation-controller");
const app = require("./app");
const express = require("express");
const expressApp = express();
const config = require("./config/config");
const configStruct = config.getConfig();

app.initApp(expressApp);

reservationsController.getReservations();

expressApp.listen(configStruct.app.port, () => {
  console.log(`Receiver Server is up on ${configStruct.app.address}`);
});
