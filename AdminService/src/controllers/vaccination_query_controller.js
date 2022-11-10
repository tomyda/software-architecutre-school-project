const vaccinationQueryService = require("../services/vaccination_query_service");

const getVaccinatedUsers = async (req, res) => {
  try {
    const response = await vaccinationQueryService.getVaccinatedUsers(req, res);
    res.status(200).json(response);
  } catch (error) {
    if (!error.status) {
      error.status = 500;
    }
    res.status(error.status).json(error);
  }
};

const getSortedPendingVaccines = async (req, res) => {
  try {
    const response = await vaccinationQueryService.getSortedPendingVaccines(
      req,
      res
    );
    console.log({ pending_vaccinations: response });
    res.status(200).json(response);
  } catch (error) {
    if (!error.status) {
      error.status = 500;
    }
    res.status(error.status).json(error);
  }
};

module.exports = {
  getVaccinatedUsers,
  getSortedPendingVaccines,
};
