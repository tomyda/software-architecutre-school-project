const getConfig = () => {
  let environment = process.argv[2] || "dev";
  if (environment != "live" || environment != "stg") {
    environment = "dev";
  }
  return require(`./env_${environment}.json`);
};

module.exports = {
  getConfig,
};
