const responsesService = require("../services/responses-service");

const sendResponse = async (req, res) => {
  try {
    res.status(200).json();
    await responsesService.sendResponse(req.body);
  } catch (error) {
    if (!error.status) {
      error.status = 500;
    }
    res.status(error.status).json(error);

    console.log(error);
  }
};

module.exports = {
  sendResponse,
};
