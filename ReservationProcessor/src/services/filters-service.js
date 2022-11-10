const glob = require("glob");

const getFilters = async () => {
  try {
    const filters = await readFilters();
    return filters;
  } catch (error) {
    console.log(error);
  }
};

const readFilters = () => {
  const validators = [];
  getValidatorsData(validators);

  const transformations = [];
  getTransformationsData(transformations);

  const data = { validations: validators, transformations: transformations };
  return data;
};

const getValidatorsData = (validators) => {
  const validatorFiles = glob.sync("validators/*.js");
  validatorFiles.forEach((file) => {
    const Validator = require(`../${file}`);
    const validator = new Validator();
    if (file != "validators/abstract-validator.js") {
      validators.push(validator.Name());
    }
  });
};

const getTransformationsData = (transformations) => {
  const transformFiles = glob.sync("transformations/*.js");
  transformFiles.forEach((file) => {
    const Transformation = require(`../${file}`);
    const transformation = new Transformation();
    if (file != "transformations/abstract-transformation.js") {
      transformations.push(transformation.Name());
    }
  });
};

module.exports = {
  getFilters,
};
