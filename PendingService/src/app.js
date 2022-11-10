const redis = require("redis");
const express = require("express");
const mongoose = require("mongoose");
const Queue = require("bull");
const fetch = require("node-fetch");

const mongodb = require("./db/mongoose");
const config = require("./config/config");
const pendingRoutes = require("./routes/pending_routes");
const newQuotaService = require("./../src/services/new_quota_services");
const configStruct = config.getConfig();

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

  // Middlewares
  expressApp.use(express.json());
  expressApp.use(function (req, res, next) {
    // we add things to req, so all service has access to it
    req.adminDB = adminDB;
    req.reservationsDB = reservationsDB;
    req.redis = redisClient;
    next();
  });

  // route middlewares
  expressApp.use("/api", pendingRoutes);

  expressApp.listen(configStruct.app.port, () => {
    console.log(
      `Pending Service is up and running on: ${configStruct.app.address}`
    );
  });

  // Listeners (for new quota)
  initializeListeners(redisClient, token);
};

const initializeListeners = (redisClient, token) => {
  const newQuotaQueue = new Queue(
    configStruct.redis_quota.queue_read_channel,
    `redis://${configStruct.redis_quota.host}:${configStruct.redis_quota.port}`
  );

  newQuotaQueue.process(100, async (job, done) => {
    newQuotaService.processNewQuota(job.data, token, redisClient);
    done();
  });
};

const getTokenFromAuthService = async () => {
  var resultAsJson;
  var error;
  await fetch(configStruct.auth_service.service_token, {
    method: "POST",
    body: JSON.stringify({ user_id: "pending_service" }),
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
    process.exit(1);
  }
  if (resultAsJson.status && resultAsJson.status != 200) {
    console.log(
      "Error getting token from auth service. Please ensure the auth service is up and running."
    );
    process.exit(1);
  }

  return resultAsJson.access_token;
};

module.exports = {
  initApp,
};
