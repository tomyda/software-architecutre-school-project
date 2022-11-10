const express = require("express");
const Queue = require("bull");

const reservationsRoutes = require("./routes/reservations-router");
const config = require("./config/config");
const configStruct = config.getConfig();
const mongodb = require("./db/mongoose");

// initApp initializes the service and the expressApp (mongo, redis, middlewares and routes)
const initApp = (expressApp) => {
  mongodb.initDB();

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
    next();
  });

  // route middlewares
  expressApp.use("/api", reservationsRoutes);
};

module.exports = {
  initApp,
};
