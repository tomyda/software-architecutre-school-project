const config = require("./../config/config");
const Logger = require("../../logger/src/logger");
const logger = new Logger();
const queries = require("./query_service");
const mongoose = require("mongoose");

const getQuery2 = async (req) => {
  logger.info(
    "A user requested to get the state and zone of the vaccinated users in between two provided dates and ages"
  );
  fromDate = req.query.from_date;
  toDate = req.query.to_date;
  fromAge = req.query.from_age;
  toAge = req.query.to_age;

  const selectionFilters = {
    vaccination_date: {
      $gte: new Date(fromDate),
      $lte: new Date(toDate),
    },
    age: {
      $gte: parseInt(fromAge),
      $lte: parseInt(toAge),
    },
    was_vaccinated: true,
  };

  const proyection = "state zone -_id";
  logger.info(
    "A user successfully got the state and zone of the vaccinated users in between two provided dates and ages"
  );
  return await queries.queryAlgorithm(req, selectionFilters, proyection);
};

module.exports = {
  getQuery2,
};
