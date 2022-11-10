const redis = require("redis");
const express = require("express");
const mongoose = require("mongoose");
const fetch = require("node-fetch");

const mongodb = require("./db/mongoose");
const filtersRoutes = require("./routes/filters-routes");
const reservationRoutes = require("./routes/reservation");
const reservationErr = require("./errors/reservation_error");
const PipelineCreator = require("./services/pipeline-creator-service");
const ReservationService = require("./services/reservation_service");
const initConfiguration = require("./services/initConfigurationService");
const config = require("./config/config");
const configStruct = config.getConfig();

var filters;
var configuration;

const initApp = async (expressApp) => {
  // Get Auth Token
  let token = await getTokenFromAuthService();

  // Mongo
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
  var redisClient = redis.createClient(
    `redis://${configStruct.redis.host}:${configStruct.redis.port}`
  );

  // Filter "Pipeline"
  try {
    let error = await initFilters(redisClient, token);
    // If pipeline was not built, shut down app
    if (error) {
      // TODO: LOG ERROR.
      process.exit(1);
    }
  } catch (error) {
    process.exit(1);
  }

  try {
    let error = await initConfigurations();
    // If pipeline was not built, shut down app
    if (error) {
      // TODO: LOG ERROR.
      process.exit(1);
    }
  } catch (error) {
    process.exit(1);
  }

  // Middlewares
  expressApp.use(express.json());
  expressApp.use(function (req, res, next) {
    // we add things to req, so all service has access to it
    req.token = token;
    req.adminDB = adminDB;
    req.reservationsDB = reservationsDB;
    req.redis = redisClient;
    req.validations = filters.validationsArray;
    req.transformations = filters.transformationsArray;
    req.late_validations = filters.lateValidationsArray;
    req.configuration = configuration;
    next();
  });

  // route middlewares
  expressApp.use("/api", filtersRoutes);
  expressApp.use("/api/reservations", reservationRoutes);

  expressApp.listen(configStruct.app.port, () => {
    console.log(
      `Processor Server is up and running on: ${configStruct.app.address}`
    );
  });
};

const initFilters = async (redis, token) => {
  try {
    // TODO: DOCUMENT ==> Se crea una unica vez, es menos modificable que armarla para cada pegada, pero asumimos que es algo que no va a modificarse tan seguido. Mejora muhco la performance.
    // TODO: THIS IS NOT A PIPELINE, BUT WE DID NOT HAVE TIME TO CHANGE THIS NAME. ITS JUST A LIST OF VALIDATIONS.
    filters = await PipelineCreator.createQueuePipeline(redis, token);
  } catch (error) {
    return error;
  }
};

const initConfigurations = async () => {
  try {
    // TODO: DOCUMENT ==> Se crea una unica vez, es menos modificable que armarla para cada pegada, pero asumimos que es algo que no va a modificarse tan seguido. Mejora muhco la performance.
    configuration = await initConfiguration.initConfig();
  } catch (error) {
    return error;
  }
};

const getTokenFromAuthService = async () => {
  var resultAsJson;
  var error;
  await fetch(configStruct.auth_service.service_token, {
    method: "POST",
    body: JSON.stringify({ user_id: "processor_service" }),
    headers: { "Content-Type": "application/json" },
  })
    .then((data) => data.json())
    .then((json) => {
      resultAsJson = json;
    })
    .catch((err) => {
      error = err;
    });

  if (error) {
    console.log(
      "Error getting token from auth service. Please ensure the auth service is up and running."
    );
    let err = new reservationErr.ReservationsError(
      "Error generating token for service",
      500
    );
    process.exit(1);
  }
  if (resultAsJson.status && resultAsJson.status != 200) {
    console.log(
      "Error getting token from auth service. Please ensure the auth service is up and running."
    );
    let err = new reservationErr.ReservationsError(
      "Error generating token for service",
      500
    );
    process.exit(1);
  }

  return resultAsJson.access_token;
};

module.exports = {
  initApp,
};
