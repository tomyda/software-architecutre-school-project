const express = require("express");
const mongoose = require("mongoose");

const providerRoutes = require("./routes/provider_routes");
const mongodb = require("./db/mongoose");

// initApp initializes the service and the expressApp (mongo, redis, middlewares and routes)
const initApp = async (expressApp) => {
  let populationsDB = await mongodb.initPopulationsDB(mongoose);

  if (populationsDB.readyState != 1 || populationsDB.readyState != 1) {
    // TODO: LOG ERROR ==> Unable to connecto to mongo
    process.exit(1);
  }
  console.log(
    "successfully connected to mongo databse: " + populationsDB.name + "."
  );

  // Middlewares
  expressApp.use(express.json());
  expressApp.use(function (req, res, next) {
    // we add redis queue to req, so all service have access to it
    req.populationsDB = populationsDB;
    next();
  });

  // route middlewares
  expressApp.use("/api/provider", providerRoutes);
};

module.exports = {
  initApp,
};
