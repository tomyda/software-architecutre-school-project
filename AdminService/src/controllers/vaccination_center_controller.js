const vaccinationCenterService = require("../services/vaccination_center_service");

const addVaccinationCenter = async (req, res) => {
  try {
    await vaccinationCenterService.addVaccinationCenter(req);
    res.status(200).json();
  } catch (error) {
    if (!error.status) {
      error.status = 500;
    }
    res.status(error.status).json(error);
  }
};

const updateVaccinationCenterQuota = async (req, res) => {
  try {
    await vaccinationCenterService.updateVaccinationCenterQuota(req, req.queue);
    res.status(200).json();
  } catch (error) {
    if (!error.status) {
      error.status = 500;
    }
    res.status(error.status).json(error);
  }
};

module.exports = {
  addVaccinationCenter,
  updateVaccinationCenterQuota,
};
