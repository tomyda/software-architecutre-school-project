const config = require("./../config/config");
const Logger = require("../../logger/src/logger");
const logger = new Logger();
const queries = require("./query_service");
const mongoose = require("mongoose");

const getQuery3 = async (req) => {
  logger.info("A user requested to get the states of the pending reservations");

  const selectionFilters = {
    status: "pending",
  };

  const proyection = "state -_id";
  logger.info("A user successfully got the states of the pending reservations");
  return await queries.queryAlgorithm(req, selectionFilters, proyection);
};

module.exports = {
  getQuery3,
};
