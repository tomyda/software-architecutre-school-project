const filtersService = require("../services/filters-service");

const getFilters = async (req, res) => {
  try {
    const filters = await filtersService.getFilters();
    res.status(200).json(filters);
  } catch (error) {
    res.status(error.status).json(error.message);
  }
};

module.exports = {
  getFilters,
};
