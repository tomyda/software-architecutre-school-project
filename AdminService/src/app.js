const express = require("express");
const Queue = require("bull");
const mongoose = require("mongoose");

const vaccinationCentersRoutes = require("./routes/vaccination_center_routes");
const validationRoutes = require("./routes/validation_routes");
const adminRoutes = require("./routes/admin_routes");
const endpointRoutes = require("./routes/endpoint_routes");
const vaccinatedUserRoutes = require("./routes/vaccinated_user");
const vaccinationQueries = require("./routes/vaccination_query_routes");
const config = require("./config/config");
const configStruct = config.getConfig();
const mongodb = require("./db/mongoose");

// initApp initializes the service and the expressApp (mongo, redis, middlewares and routes)
const initApp = async (expressApp) => {
  let adminDB = await mongodb.initAdminDB(mongoose);
  let reservationsDB = await mongodb.initReservationsDB(mongoose);

  if (adminDB.readyState != 1 || reservationsDB.readyState != 1) {
    // TODO: LOG ERROR ==> Unable to connecto to mongo
    process.exit(1);
  }
  console.log(
    "successfully connected to mongo databses: " +
      adminDB.name +
      ", " +
      reservationsDB.name
  );

  // Redis

  // Middlewares
  expressApp.use(express.json());
  expressApp.use(function (req, res, next) {
    // we add redis queue to req, so all service have access to it
    var sendQueue = new Queue(
      configStruct.redis.queue_publish_channel,
      `redis://${configStruct.redis.host}:${configStruct.redis.port}`
    );
    req.queue = sendQueue;
    req.adminDB = adminDB;
    req.reservationsDB = reservationsDB;
    next();
  });

  // route middlewares
  expressApp.use("/api/vaccination-centers", vaccinationCentersRoutes);
  expressApp.use("/api/reservation-validations", validationRoutes);
  expressApp.use("/api/admins", adminRoutes);
  expressApp.use("/api/vaccinated_users", vaccinatedUserRoutes);
  expressApp.use("/api", vaccinationQueries);
  expressApp.use("/api/endpoints", endpointRoutes);
};

module.exports = {
  initApp,
};
