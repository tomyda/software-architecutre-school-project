const providerService = require("../services/provider_service");

const getCitizenInfo = async (req, res) => {
  try {
    let citizen = await providerService.getCitizenInfo(req, res);
    res.status(200).json(citizen);
  } catch (error) {
    if (!error.status) {
      error.status = 500;
    }
    res.status(error.status).json(error);
  }
};

module.exports = {
  getCitizenInfo,
};
