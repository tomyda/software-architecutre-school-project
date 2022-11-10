const query1Service = require("../services/query_1");
const query2Service = require("../services/query_2");
const query3Service = require("../services/query_3");

const getQuery1 = async (req, res) => {
  try {
    const response = await query1Service.getQuery1(req);
    res.status(200).json(response);
  } catch (error) {
    if (!error.status) {
      error.status = 500;
    }
    res.status(error.status).json(error);
  }
};

const getQuery2 = async (req, res) => {
  try {
    const response = await query2Service.getQuery2(req);
    res.status(200).json(response);
  } catch (error) {
    if (!error.status) {
      error.status = 500;
    }
    res.status(error.status).json(error);
  }
};

const getQuery3 = async (req, res) => {
  try {
    const response = await query3Service.getQuery3(req);
    res.status(200).json(response);
  } catch (error) {
    if (!error.status) {
      error.status = 500;
    }
    res.status(error.status).json(error);
  }
};

module.exports = {
  getQuery1,
  getQuery2,
  getQuery3,
};
