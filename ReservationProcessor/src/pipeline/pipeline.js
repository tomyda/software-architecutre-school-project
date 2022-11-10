const config = require("../config/config");
const configStruct = config.getConfig();

const deferBinding = () => {
  const type = configStruct.app.pipeline_type;
  const implementation = require(`./${type}-pipeline`);
  return implementation;
};

module.exports = deferBinding();
