const mongoose = require("mongoose");
const redis = require("redis");
const express = require("express");

const tokenRoute = require("./routes/token");
const config = require("./config/config");

const configStruct = config.getConfig();

// initApp initializes the service and the expressApp (mongo, redis, middlewares and routes)
const initApp = (expressApp) => {
  // Mongo
  mongoose.connect(
    configStruct.mongo.address,
    { useNewUrlParser: true, useCreateIndex: true },
    () => {
      console.log(
        "Connected to mongo db '" +
          configStruct.mongo.db_name +
          "' as user '" +
          configStruct.mongo.username +
          "'"
      );
    }
  );

  // Redis
  var redisClient = redis.createClient(configStruct.redis.port);

  // Middlewares
  expressApp.use(express.json());
  expressApp.use(function (req, res, next) {
    // we add redis client to req, so all service has access to it
    req.redis = redisClient;
    next();
  });

  // route middlewares
  expressApp.use("/api/tokens", tokenRoute);
};

module.exports = {
  initApp,
};
