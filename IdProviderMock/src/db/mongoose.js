const config = require("./../config/config");
const configStruct = config.getConfig();

const initPopulationsDB = async (mongoose) => {
  return await mongoose.createConnection(
    configStruct.mongo_population.address,
    {
      useNewUrlParser: true,
      useCreateIndex: true,
    }
  );
};

module.exports = {
  initPopulationsDB,
};
