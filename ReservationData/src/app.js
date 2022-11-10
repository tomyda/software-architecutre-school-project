const mongoDB = require("./db/mongoose");
const express = require("express");
const responsesRoutes = require("./routes/responses-routes");

module.exports = {
  initApp: (expressApp) => {
    mongoDB.initDB();
    expressApp.use(express.json());

    expressApp.use("/api/responses", responsesRoutes);
  },
};
