const config = require("./../config/config");
const configStruct = config.getConfig();
const mongoose = require("mongoose");

const initReservationsDB = async (mongoose) => {
  return await mongoose.createConnection(configStruct.mongo.address, {
    useNewUrlParser: true,
    useCreateIndex: true,
  });
};

module.exports = {
  initReservationsDB,
};
