const express = require("express");
const Queue = require("bull");
const mongoose = require("mongoose");
const queriesRoutes = require("./routes/queries");
const config = require("./config/config");
const configStruct = config.getConfig();
const mongodb = require("./db/mongoose");

// initApp initializes the service and the expressApp (mongo, redis, middlewares and routes)
const initApp = async (expressApp) => {
  let reservationsDB = await mongodb.initReservationsDB(mongoose);

  if (reservationsDB.readyState != 1) {
    console.log("Error while connecting to mongo");
    process.exit(1);
  }
  console.log(
    "successfully connected to mongo databses: " + reservationsDB.name
  );

  // Middlewares
  expressApp.use(express.json());
  expressApp.use(function (req, res, next) {
    req.reservationsDB = reservationsDB;
    next();
  });

  // route middlewares
  expressApp.use("/api/vacquerytools", queriesRoutes);
};

module.exports = {
  initApp,
};
