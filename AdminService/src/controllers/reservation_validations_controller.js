const fetch = require("node-fetch");
const Logger = require("../../logger/src/logger");
const logger = new Logger();

const validationsService = require("../services/validations_service");

const getValidations = async (req, res) => {
  logger.info("A user requested to get the validations from the service");
  try {
    let validations = await validationsService.getValidations(req);
    res.status(200).json(validations);
  } catch (error) {
    if (!error.status) {
      error.status = 500;
    }
    res.status(error.status).json(error);
  }
};

const addValidations = async (req, res) => {
  logger.info("A user requested to add a validation to the service");
  try {
    let amountAdded = await validationsService.addValidations(req);
    res.status(200).json({ validations_added: amountAdded });
  } catch (error) {
    if (!error.status) {
      error.status = 500;
    }
    res.status(error.status).json(error);
  }
};

const deleteValidations = async (req, res) => {
  try {
    await validationsService.deleteValidations(req);
    res.status(200).json();
  } catch (error) {
    if (!error.status) {
      error.status = 500;
    }
    res.status(error.status).json(error);
  }
};

module.exports = {
  addValidations,
  deleteValidations,
  getValidations,
};
