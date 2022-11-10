const config = require("./../config/config");
const Logger = require("../../logger/src/logger");
const logger = new Logger();
const queries = require("./query_service");
const mongoose = require("mongoose");

const getQuery1 = async (req) => {
  logger.info(
    "A user requested to get the state and vaccination date of the vaccinated users in between two provided dates"
  );
  fromDate = req.query.from_date;
  toDate = req.query.to_date;

  const selectionFilters = {
    vaccination_date: {
      $gte: new Date(fromDate),
      $lte: new Date(toDate),
    },
    was_vaccinated: true,
  };

  const proyection = "state vaccination_date -_id";
  logger.info(
    "A user successfully got the state and vaccination date of the vaccinated users in between two provided dates"
  );
  return await queries.queryAlgorithm(req, selectionFilters, proyection);
};

module.exports = {
  getQuery1,
};
