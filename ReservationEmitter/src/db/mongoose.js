const mongoose = require("mongoose");
const config = require("./../config/config");
const configStruct = config.getConfig();

const initDB = () => {
  mongoose.connect(
    configStruct.mongo.address,
    { useNewUrlParser: true, useCreateIndex: true },
    () => {
      console.log(
        "Connected to " +
          configStruct.mongo.driver +
          " db '" +
          configStruct.mongo.db_name +
          "' as user '" +
          configStruct.mongo.username +
          "'"
      );
    }
  );
};

module.exports = {
  initDB,
};
