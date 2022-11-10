// const redis = require("redis");
const express = require("express");

const config = require("./config/config");

const notificationRoutes = require("./routes/notification_routes");
const configStruct = config.getConfig();

// initApp initializes the service and the expressApp (mongo, redis, middlewares and routes)
const initApp = (expressApp) => {
  // Middlewares
  expressApp.use(express.json());
  expressApp.use(function (req, res, next) {
    //req.redis = redisClient;
    next();
  });

  // route middlewares
  expressApp.use("/api/notificators", notificationRoutes);
};

module.exports = {
  initApp,
};
