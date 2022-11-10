const vaccinatedUserService = require("../services/vaccinated_user_service");
const Logger = require("../../logger/src/logger");
const logger = new Logger();

const addVaccinatedUser = async (req, res) => {
  try {
    await vaccinatedUserService.markUserAsVaccinated(req);
    return res.status(200).json();
  } catch (error) {
    if (!error.status) {
      error.status = 500;
    }
    res.status(error.status).json(error);
  }
};

module.exports = {
  addVaccinatedUser,
};
