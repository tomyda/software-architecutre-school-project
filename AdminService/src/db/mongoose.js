const mongoose = require("mongoose");
const config = require("./../config/config");
const configStruct = config.getConfig();

const initAdminDB = async (mongoose) => {
  return await mongoose.createConnection(configStruct.mongo_admin.address, {
    useNewUrlParser: true,
    useCreateIndex: true,
  });
};

const initReservationsDB = async (mongoose) => {
  return await mongoose.createConnection(
    configStruct.mongo_reservations.address,
    { useNewUrlParser: true, useCreateIndex: true }
  );
};

module.exports = {
  initAdminDB,
  initReservationsDB,
};
