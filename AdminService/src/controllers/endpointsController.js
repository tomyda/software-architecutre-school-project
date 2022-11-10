const Logger = require("../../logger/src/logger");
const logger = new Logger();

const endpointsService = require("../services/endpoints_service");

const getEndpoint = async (req, res) => {
  logger.info("A user requested to get the endpoint from the service");
  try {
    let endpoint = await endpointsService.getEndpoint(req);
    res.status(200).json(endpoint);
  } catch (error) {
    if (!error.status) {
      error.status = 500;
    }
    res.status(error.status).json(error);
  }
};

const addEndpoint = async (req, res) => {
  logger.info("A user requested to add an enpoint to the service");
  try {
    let response = await endpointsService.addEndpoint(req);
    res.status(200).json(response);
  } catch (error) {
    if (!error.status) {
      error.status = 500;
    }
    res.status(error.status).json(error);
  }
};

const deleteEndpoint = async (req, res) => {
  logger.info("A user requested to delete an enpoint to the service");
  try {
    const result = await endpointsService.deleteEndpoint(req);
    res.status(200).json(result);
  } catch (error) {
    if (!error.status) {
      error.status = 500;
    }
    res.status(error.status).json(error);
  }
};

module.exports = {
  addEndpoint,
  deleteEndpoint,
  getEndpoint,
};
